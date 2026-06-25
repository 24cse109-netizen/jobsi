import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import { createClient as createSupabaseServerClient } from "@supabase/supabase-js";
import { createClient as createSupabaseServerSSR } from "@supabase/ssr";
import {
  nav,
  jobs,
  notifications,
  skills,
  roadmap,
  applications,
  tests,
  messages,
  userProfile,
  analytics,
  dashboard,
  resumeAnalysis,
  userSettings,
  authUsers,
} from "./data.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendBuildPath = path.join(__dirname, "frontend/dist");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendBuildPath));

const getAuthToken = (user) => Buffer.from(`${user.id}:${user.email}`).toString("base64");

let supabaseEnabled = false;
let supabaseServer = null;

const seedData = { jobs, applications, tests, skills, roadmap, notifications, messages, authUsers, profile: { profile: userProfile, skills }, analytics, dashboard, resumeAnalysis, settings: userSettings };

function normalizeDoc(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}

async function seedDatabase() {
  // Seed data into Supabase tables if they are empty.
  if (!supabaseEnabled) return;
  for (const [table, payload] of Object.entries(seedData)) {
    try {
      const { data: existing } = await supabaseServer.from(table).select("id").limit(1);
      if (existing && existing.length > 0) continue;
      if (Array.isArray(payload)) {
        if (payload.length > 0) {
          await supabaseServer.from(table).insert(payload);
        }
      } else {
        await supabaseServer.from(table).insert(payload);
      }
    } catch (e) {
      console.warn(`Seeding table ${table} failed: ${e.message}`);
    }
  }
}

async function getAll(collectionName, fallback) {
  if (!supabaseEnabled) return fallback;
  try {
    const { data, error } = await supabaseServer.from(collectionName).select();
    if (error) throw error;
    return data || fallback;
  } catch (e) {
    console.warn(e.message);
    return fallback;
  }
}

async function getSingleton(collectionName, fallback) {
  if (!supabaseEnabled) return fallback;
  try {
    const { data, error } = await supabaseServer.from(collectionName).select().limit(1).maybeSingle();
    if (error) throw error;
    if (data) return data;
    if (fallback) {
      await supabaseServer.from(collectionName).insert(fallback);
      return fallback;
    }
    return null;
  } catch (e) {
    console.warn(e.message);
    return fallback;
  }
}

app.get("/api/nav", (req, res) => res.json(nav));

app.get("/api/dashboard", async (req, res) => {
  res.json(await getSingleton("dashboard", dashboard));
});

app.get("/api/profile", async (req, res) => {
  res.json(await getSingleton("profile", { profile: userProfile, skills }));
});

app.get("/api/jobs", async (req, res) => {
  const allJobs = await getAll("jobs", jobs);
  const filter = req.query.filter;
  if (filter === "90+") {
    return res.json(allJobs.filter((job) => job.match >= 90));
  }
  res.json(allJobs);
});

app.get("/api/applications", async (req, res) => {
  res.json(await getAll("applications", applications));
});

app.get("/api/tests", async (req, res) => {
  res.json(await getAll("tests", tests));
});

app.get("/api/skills", async (req, res) => {
  res.json(await getAll("skills", skills));
});

app.get("/api/roadmap", async (req, res) => {
  res.json(await getAll("roadmap", roadmap));
});

app.get("/api/notifications", async (req, res) => {
  res.json(await getAll("notifications", notifications));
});

app.put("/api/notifications/read-all", async (req, res) => {
  if (!supabaseEnabled) {
    notifications.forEach((item) => { item.unread = false; });
    return res.json({ success: true, notifications });
  }
  try {
    await supabaseServer.from("notifications").update({ unread: false }).neq("id", null);
    const { data } = await supabaseServer.from("notifications").select();
    res.json({ success: true, notifications: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/messages", async (req, res) => {
  res.json(await getAll("messages", messages));
});

app.get("/api/analytics", async (req, res) => {
  res.json(await getSingleton("analytics", analytics));
});

app.get("/api/settings", async (req, res) => {
  res.json(await getSingleton("settings", userSettings));
});

app.put("/api/settings", async (req, res) => {
  const updates = req.body;
  if (!mongoEnabled) {
    Object.assign(userSettings, updates);
    return res.json({ success: true, settings: userSettings });
  }
  const collection = getCollection("settings");
  const result = await collection.findOneAndUpdate({}, { $set: updates }, { returnDocument: "after", upsert: true });
  res.json({ success: true, settings: normalizeDoc(result.value) });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  if (!mongoEnabled) {
    if (authUsers.some((user) => user.email === email)) {
      return res.status(409).json({ error: "Email already registered." });
    }
    const newUser = {
      id: authUsers.length + 1,
      name,
      email,
      password,
      role: role || "seeker",
    };
    authUsers.push(newUser);
    const token = getAuthToken(newUser);
    return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, token });
  }

  const collection = getCollection("authUsers");
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered." });
  }

  const newUser = {
    name,
    email,
    password,
    role: role || "seeker",
    createdAt: new Date().toISOString(),
  };
  const result = await collection.insertOne(newUser);
  const user = {
    id: result.insertedId.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
  const token = getAuthToken(user);
  res.status(201).json({ user, token });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!mongoEnabled) {
    const user = authUsers.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = getAuthToken(user);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  }

  const collection = getCollection("authUsers");
  const user = await collection.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  const userResponse = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = getAuthToken(userResponse);
  res.json({ user: userResponse, token });
});

app.post("/api/resume/analyze", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  res.json(await getSingleton("resumeAnalysis", resumeAnalysis));
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }
  const normalized = message.toLowerCase();
  let reply = "I'm here to help you with your career search. What would you like to work on next?";

  if (normalized.includes("resume")) {
    reply = "Review your resume for quantified achievements, keywords like Kubernetes and microservices, and a clear project section.";
  } else if (normalized.includes("job match")) {
    reply = "Your best matches are roles that use Python, Django, and cloud experience. Keep your profile updated for remote opportunities.";
  } else if (normalized.includes("interview")) {
    reply = "Focus on problem-solving, system design, and behavioral examples. Practice with mock interviews and review your resume stories.";
  }

  res.json({ reply });
});

app.get("/api/status", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Serve SPA - catch all non-API routes and serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Supabase / DB status endpoint
app.get("/api/db-status", async (req, res) => {
  if (!supabaseEnabled) {
    return res.json({ supabase: false, message: "Supabase not configured or unreachable" });
  }

  try {
    const { data, error } = await supabaseServer.from('jobs').select('id').limit(1);
    if (error) throw error;
    return res.json({ supabase: true, sampleCount: Array.isArray(data) ? data.length : 0 });
  } catch (e) {
    return res.status(500).json({ supabase: false, error: e.message });
  }
});

try {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (supabaseUrl && supabaseKey) {
      // Using the JS client from supabase for simple server operations
      // NOTE: for server-side SSR with cookies you should use @supabase/ssr helpers
      // Here we create a generic server client for seeding and basic queries.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createClient } = require('@supabase/supabase-js');
      supabaseServer = createClient(supabaseUrl, supabaseKey);
      supabaseEnabled = true;
      await seedDatabase();
    } else {
      console.warn('Supabase env vars not set. Running with in-memory fallback data.');
    }
  } catch (e) {
    console.warn(`Supabase initialization failed: ${e.message}`);
    supabaseEnabled = false;
  }

  async function startListening(startPort, maxAttempts = 5) {
    let p = startPort;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await new Promise((resolve, reject) => {
          const srv = app.listen(p, () => {
            console.log(`Jobsi backend listening on http://localhost:${p}`);
            resolve(srv);
          });
          srv.on("error", (err) => reject(err));
        });
        return;
      } catch (err) {
        if (err && err.code === "EADDRINUSE") {
          console.warn(`Port ${p} is in use, trying next port...`);
          p++;
          continue;
        }
        throw err;
      }
    }
    throw new Error("Unable to bind to any port.");
  }

  await startListening(port);
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
