import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
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

const app = express();
const port = process.env.PORT || 4000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendBuildPath = path.join(__dirname, "frontend/dist");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendBuildPath));

const getAuthToken = (user) => {
  return Buffer.from(`${user.id}:${user.email}`).toString("base64");
};

app.get("/api/nav", (req, res) => res.json(nav));

app.get("/api/dashboard", (req, res) => res.json(dashboard));

app.get("/api/profile", (req, res) => res.json({ profile: userProfile, skills }));

app.get("/api/jobs", (req, res) => {
  const filter = req.query.filter;
  if (filter === "90+") {
    return res.json(jobs.filter((job) => job.match >= 90));
  }
  return res.json(jobs);
});

app.get("/api/applications", (req, res) => res.json(applications));

app.get("/api/tests", (req, res) => res.json(tests));

app.get("/api/skills", (req, res) => res.json(skills));

app.get("/api/roadmap", (req, res) => res.json(roadmap));

app.get("/api/notifications", (req, res) => res.json(notifications));

app.put("/api/notifications/read-all", (req, res) => {
  notifications.forEach((item) => { item.unread = false; });
  res.json({ success: true, notifications });
});

app.get("/api/messages", (req, res) => res.json(messages));

app.get("/api/analytics", (req, res) => res.json(analytics));

app.get("/api/settings", (req, res) => res.json(userSettings));

app.put("/api/settings", (req, res) => {
  const updates = req.body;
  Object.assign(userSettings, updates);
  res.json({ success: true, settings: userSettings });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
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
  res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, token });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = authUsers.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  const token = getAuthToken(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
});

app.post("/api/resume/analyze", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  res.json(resumeAnalysis);
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

app.listen(port, () => {
  console.log(`Jobsi backend listening on http://localhost:${port}`);
});
