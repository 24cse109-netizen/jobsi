const T = {
  bg0: "#05070F",
  bg1: "#090D1A",
  bg2: "#0D1226",
  surface: "#111827",
  surfaceHi: "#161E35",
  border: "rgba(255,255,255,0.06)",
  borderMid: "rgba(255,255,255,0.12)",
  borderHi: "rgba(99,102,241,0.5)",
  blue: "#3B6EF8",
  cyan: "#22D3EE",
  green: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  violet: "#8B5CF6",
};

const nav = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "profile", icon: "👤", label: "My Profile" },
  { id: "resume", icon: "📄", label: "Resume Analysis" },
  { id: "jobs", icon: "🎯", label: "Job Matches" },
  { id: "applications", icon: "📋", label: "Applications" },
  { id: "tests", icon: "🧪", label: "Screening Tests" },
  { id: "skills", icon: "📊", label: "Skill Gap Analysis" },
  { id: "roadmap", icon: "🗺️", label: "Career Roadmap" },
  { id: "messages", icon: "💬", label: "Messages" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const jobs = [
  { company: "Google", role: "Python Developer", match: 94, logo: "G", color: "#4285F4", salary: "$130k–160k", type: "Remote", skills: ["Python", "Django", "GCP"], missing: ["Kubernetes"] },
  { company: "Microsoft", role: "Backend Developer", match: 91, logo: "M", color: "#00A4EF", salary: "$120k–155k", type: "Hybrid", skills: ["Node.js", "Azure", "TypeScript"], missing: ["Microservices"] },
  { company: "Amazon", role: "Software Engineer", match: 89, logo: "A", color: "#FF9900", salary: "$125k–165k", type: "On-site", skills: ["Java", "AWS", "Spring"], missing: ["Kafka"] },
  { company: "Meta", role: "Full Stack Engineer", match: 85, logo: "f", color: "#0081FB", salary: "$140k–180k", type: "Remote", skills: ["React", "Python", "GraphQL"], missing: ["Hack"] },
  { company: "Stripe", role: "API Engineer", match: 82, logo: "S", color: "#635BFF", salary: "$135k–170k", type: "Hybrid", skills: ["Ruby", "Go", "APIs"], missing: ["Payments"] },
];

const notifications = [
  { icon: "🎯", title: "94% match — Google Python Developer", time: "2 min ago", unread: true, color: T.green },
  { icon: "🧪", title: "Amazon invited you to take DSA Test", time: "18 min ago", unread: true, color: T.amber },
  { icon: "👁️", title: "Meta recruiter viewed your profile", time: "1 hr ago", unread: false, color: T.blue },
  { icon: "✅", title: "Microsoft shortlisted your application", time: "3 hr ago", unread: false, color: T.violet },
];

const skills = [
  { label: "Python", have: 85, need: 90, color: T.blue },
  { label: "Machine Learning", have: 60, need: 80, color: T.violet },
  { label: "System Design", have: 45, need: 85, color: T.rose },
  { label: "React.js", have: 90, need: 75, color: T.cyan },
  { label: "SQL", have: 78, need: 70, color: T.green },
  { label: "Docker", have: 40, need: 75, color: T.amber },
];

const roadmap = [
  { title: "Python Developer", current: true, time: "Now", skills: ["Python", "Django", "REST APIs"] },
  { title: "Backend Developer", time: "+8 months", skills: ["Microservices", "Docker", "Node.js"] },
  { title: "Full Stack Developer", time: "+18 months", skills: ["React", "Next.js", "GraphQL"] },
  { title: "Senior Engineer", time: "+2.5 years", skills: ["System Design", "AWS", "Leadership"] },
  { title: "Solution Architect", time: "+4 years", skills: ["Cloud Architecture", "Strategy", "Mentoring"] },
];

const applications = [
  { company: "Google", role: "Python Developer", date: "Jun 18", status: "Screening", logo: "G", color: "#4285F4" },
  { company: "Microsoft", role: "Backend Developer", date: "Jun 15", status: "Shortlisted", logo: "M", color: "#00A4EF" },
  { company: "Flipkart", role: "Software Engineer", date: "Jun 10", status: "Applied", logo: "F", color: "#F97316" },
  { company: "Swiggy", role: "Backend Engineer", date: "Jun 8", status: "Rejected", logo: "S", color: T.rose },
  { company: "Atlassian", role: "Cloud Engineer", date: "Jun 5", status: "Applied", logo: "A", color: "#0052CC" },
];

const tests = [
  { title: "Python Advanced", company: "Google", dur: "45 min", q: 30, diff: "Hard", cat: "Technical", color: T.blue },
  { title: "DSA — Coding Round", company: "Amazon", dur: "60 min", q: 25, diff: "Hard", cat: "Coding", color: T.violet },
  { title: "System Design", company: "Microsoft", dur: "90 min", q: 10, diff: "Expert", cat: "Technical", color: T.rose },
  { title: "Aptitude & Reasoning", company: "TCS", dur: "30 min", q: 40, diff: "Medium", cat: "Aptitude", color: T.amber },
];

const messages = [
  { name: "Google Recruiter", last: "Looking forward to your application...", time: "2h", avatar: "G", color: "#4285F4", unread: 2 },
  { name: "Microsoft HR", last: "Congratulations on being shortlisted!", time: "1d", avatar: "M", color: "#00A4EF", unread: 0 },
  { name: "Stripe Talent", last: "Can you share your availability for...", time: "2d", avatar: "S", color: "#635BFF", unread: 1 },
];

const userProfile = {
  name: "Rahul Shah",
  title: "Python Developer",
  location: "Bangalore, India",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  experience: "3 Years",
  availability: "Immediate",
  links: [
    { icon: "🐙", label: "github.com/rahul", url: "https://github.com/rahul" },
    { icon: "💼", label: "linkedin.com/in/rahul", url: "https://linkedin.com/in/rahul" },
    { icon: "🌐", label: "rahulshah.dev", url: "https://rahulshah.dev" },
    { icon: "📄", label: "Resume PDF", url: "#/resume" },
  ],
  workExperience: {
    title: "Python Backend Developer",
    company: "Infosys Ltd.",
    location: "Bangalore",
    dateRange: "Jan 2022 – Present",
    summary: "Built scalable microservices using FastAPI and Django, improving system throughput by 40%. Led migration of legacy systems to cloud-native architecture on AWS serving 2M+ users.",
  },
};

const analytics = {
  summary: [
    { icon: "📋", label: "Applications", value: 58, color: T.blue },
    { icon: "✅", label: "Shortlisted", value: 12, color: T.green },
    { icon: "📞", label: "Interviews", value: 6, color: T.violet },
    { icon: "🎉", label: "Offers", value: 2, color: T.amber },
  ],
  weeklyApplications: [3, 7, 5, 12, 8, 14, 9],
  matchTrend: [76, 80, 83, 87, 91, 94],
};

const dashboard = {
  greeting: "Welcome back, Rahul 👋",
  status: "AI job scanner active · 3 new matches today",
  kpis: [
    { icon: "⚡", label: "AI Employability", val: 87, color: T.blue },
    { icon: "💪", label: "Profile Strength", val: 72, color: T.violet },
    { icon: "✅", label: "Skills Verified", val: 70, color: T.cyan },
    { icon: "🎯", label: "Job Matches", val: 46, color: T.green },
    { icon: "📋", label: "Applications", val: 40, color: T.amber },
    { icon: "🧪", label: "Tests Ready", val: 80, color: T.rose },
  ],
  weeklyApplications: [3, 7, 5, 12, 8, 14, 9],
};

const resumeAnalysis = {
  metrics: [
    { label: "Resume Score", value: 88, color: T.blue },
    { label: "ATS Score", value: 76, color: T.violet },
    { label: "Keyword Match", value: 82, color: T.cyan },
  ],
  extractedSkills: ["Python", "Django", "FastAPI", "PostgreSQL", "AWS", "Docker", "React.js", "REST APIs", "Git", "Linux", "CI/CD"],
  missingKeywords: ["Kubernetes", "Microservices", "GraphQL", "Redis", "Kafka", "System Design", "Terraform"],
  suggestions: [
    { icon: "⚡", text: "Add quantified results — '40% throughput improvement' is stronger than 'improved performance'.", priority: "High", color: T.rose },
    { icon: "🎯", text: "Add Kubernetes & microservices — they appear in 78% of your target job descriptions.", priority: "High", color: T.rose },
    { icon: "📊", text: "Include a Projects section with 2–3 GitHub links and impact metrics.", priority: "Medium", color: T.amber },
    { icon: "✏️", text: "Replace passive verbs with action verbs: 'architected', 'optimized', 'automated'.", priority: "Medium", color: T.amber },
  ],
};

const userSettings = {
  jobMatch: true,
  tests: true,
  views: false,
  email: true,
};

const authUsers = [
  { id: 1, name: "Rahul Shah", email: "rahul@example.com", password: "password123", role: "seeker" },
];

export {
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
};
