import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════ */
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
  blueGlow: "rgba(59,110,248,0.35)",
  indigo: "#6366F1",
  violet: "#8B5CF6",
  cyan: "#22D3EE",
  green: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  text: "#F0F4FF",
  textMid: "#8B93B0",
  textDim: "#3D4A6B",
  grad1: "linear-gradient(135deg,#3B6EF8 0%,#8B5CF6 100%)",
  grad2: "linear-gradient(135deg,#22D3EE 0%,#3B6EF8 100%)",
  grad3: "linear-gradient(135deg,#8B5CF6 0%,#F43F5E 100%)",
};

const css = String.raw;

const GLOBAL_CSS = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{font-family:'Inter',sans-serif;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.4);border-radius:4px;}
  @keyframes pulse-ring{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2);opacity:0}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
  @keyframes spinSlow{to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(59,110,248,0.3)}50%{box-shadow:0 0 40px rgba(59,110,248,0.6)}}
  @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes barGrow{from{height:0%}to{height:var(--h)}}
  @keyframes arcDraw{from{stroke-dashoffset:var(--full)}to{stroke-dashoffset:var(--offset)}}
  @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes typeWrite{from{width:0}to{width:100%}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
`;

/* ═══════════════════════════════════════
   REUSABLE PRIMITIVES
═══════════════════════════════════════ */
function Orbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {[
        { w: 700, h: 700, top: "-20%", left: "-15%", c: "rgba(59,110,248,0.07)" },
        { w: 600, h: 600, top: "30%", right: "-20%", c: "rgba(139,92,246,0.06)" },
        { w: 400, h: 400, bottom: "-10%", left: "40%", c: "rgba(34,211,238,0.05)" },
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.w,
            height: o.h,
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            background: `radial-gradient(circle,${o.c} 0%,transparent 70%)`,
            borderRadius: "50%",
            animation: `orbFloat ${14 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function GlassPane({ children, style = {}, onClick, hover = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? "rgba(17,24,39,0.9)" : "rgba(13,18,38,0.75)",
        border: `1px solid ${hov ? T.borderMid : T.border}`,
        borderRadius: 16,
        backdropFilter: "blur(16px)",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        transform: hov && hover ? "translateY(-3px) scale(1.005)" : "none",
        boxShadow: hov && hover ? "0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(99,102,241,0.15)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {}, size = "md" }) {
  const [hov, setHov] = useState(false);
  const [act, setAct] = useState(false);
  const pad = size === "sm" ? "7px 16px" : size === "lg" ? "14px 36px" : "10px 22px";
  const fs = size === "sm" ? 12 : size === "lg" ? 16 : 14;
  const bg = {
    primary: `linear-gradient(135deg,#3B6EF8,#8B5CF6)`,
    cyan: `linear-gradient(135deg,#22D3EE,#3B6EF8)`,
    ghost: "rgba(255,255,255,0.04)",
    danger: "rgba(244,63,94,0.15)",
  }[variant] || T.grad1;
  const border = {
    ghost: `1px solid ${T.border}`,
    danger: "1px solid rgba(244,63,94,0.35)",
  }[variant] || "none";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        setAct(false);
      }}
      onMouseDown={() => setAct(true)}
      onMouseUp={() => setAct(false)}
      style={{
        background: bg,
        border,
        borderRadius: 10,
        color: "#fff",
        padding: pad,
        fontSize: fs,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        opacity: hov ? 0.88 : 1,
        transform: act ? "scale(0.97)" : hov ? "scale(1.02)" : "scale(1)",
        transition: "all 0.15s cubic-bezier(.4,0,.2,1)",
        boxShadow: hov && variant === "primary" ? "0 8px 28px rgba(59,110,248,0.4)" : "none",
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ label, color = T.blue }) {
  return (
    <span
      style={{
        background: color + "18",
        color,
        border: `1px solid ${color}33`,
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

function Ring({ val = 75, size = 88, stroke = 7, color = T.blue, label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (val / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ - filled}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
            filter: `drop-shadow(0 0 6px ${color}88)`,
          }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.36em"
          style={{
            fill: T.text,
            fontSize: size * 0.2,
            fontWeight: 700,
            transform: "rotate(90deg)",
            transformOrigin: "50% 50%",
            fontFamily: "Inter,sans-serif",
          }}
        >
          {val}%
        </text>
      </svg>
      {label && (
        <span style={{ fontSize: 12, color: T.textMid, textAlign: "center", maxWidth: 80 }}>{label}</span>
      )}
      {sublabel && <span style={{ fontSize: 11, color: T.textDim, textAlign: "center" }}>{sublabel}</span>}
    </div>
  );
}

function Counter({ end, suffix = "", duration = 1400 }) {
  const [n, setN] = useState(0);
  const ref = useRef();

  useEffect(() => {
    let start = 0;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      start = Math.floor(ease * end);
      setN(start);
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [end, duration]);

  return <>{n}{suffix}</>;
}

function LiveDot({ color = T.green }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          animation: "pulse-ring 1.8s ease-out infinite",
        }}
      />
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, position: "relative" }} />
    </span>
  );
}

const NAV = [
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

const JOBS = [
  { company: "Google", role: "Python Developer", match: 94, logo: "G", color: "#4285F4", salary: "$130k–160k", type: "Remote", skills: ["Python", "Django", "GCP"], missing: ["Kubernetes"] },
  { company: "Microsoft", role: "Backend Developer", match: 91, logo: "M", color: "#00A4EF", salary: "$120k–155k", type: "Hybrid", skills: ["Node.js", "Azure", "TypeScript"], missing: ["Microservices"] },
  { company: "Amazon", role: "Software Engineer", match: 89, logo: "A", color: "#FF9900", salary: "$125k–165k", type: "On-site", skills: ["Java", "AWS", "Spring"], missing: ["Kafka"] },
  { company: "Meta", role: "Full Stack Engineer", match: 85, logo: "f", color: "#0081FB", salary: "$140k–180k", type: "Remote", skills: ["React", "Python", "GraphQL"], missing: ["Hack"] },
  { company: "Stripe", role: "API Engineer", match: 82, logo: "S", color: "#635BFF", salary: "$135k–170k", type: "Hybrid", skills: ["Ruby", "Go", "APIs"], missing: ["Payments"] },
];

const NOTIFS = [
  { icon: "🎯", title: "94% match — Google Python Developer", time: "2 min ago", unread: true, color: T.green },
  { icon: "🧪", title: "Amazon invited you to take DSA Test", time: "18 min ago", unread: true, color: T.amber },
  { icon: "👁️", title: "Meta recruiter viewed your profile", time: "1 hr ago", unread: false, color: T.blue },
  { icon: "✅", title: "Microsoft shortlisted your application", time: "3 hr ago", unread: false, color: T.violet },
];

const SKILLS = [
  { label: "Python", have: 85, need: 90, color: T.blue },
  { label: "Machine Learning", have: 60, need: 80, color: T.violet },
  { label: "System Design", have: 45, need: 85, color: T.rose },
  { label: "React.js", have: 90, need: 75, color: T.cyan },
  { label: "SQL", have: 78, need: 70, color: T.green },
  { label: "Docker", have: 40, need: 75, color: T.amber },
];

const ROADMAP = [
  { title: "Python Developer", current: true, time: "Now", skills: ["Python", "Django", "REST APIs"] },
  { title: "Backend Developer", time: "+8 months", skills: ["Microservices", "Docker", "Node.js"] },
  { title: "Full Stack Developer", time: "+18 months", skills: ["React", "Next.js", "GraphQL"] },
  { title: "Senior Engineer", time: "+2.5 years", skills: ["System Design", "AWS", "Leadership"] },
  { title: "Solution Architect", time: "+4 years", skills: ["Cloud Architecture", "Strategy", "Mentoring"] },
];

function Landing({ onEnter }) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: T.bg0, minHeight: "100vh", color: T.text, fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "0 40px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: y > 30 ? "rgba(5,7,15,0.9)" : "transparent",
        backdropFilter: y > 30 ? "blur(24px)" : "none",
        borderBottom: y > 30 ? `1px solid ${T.border}` : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: T.grad1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 900,
            color: "#fff",
            boxShadow: "0 0 20px rgba(59,110,248,0.5)",
          }}>J</div>
          <span style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg,#93C5FD,#C4B5FD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Jobsi</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn variant="ghost" onClick={onEnter} size="sm">Sign in</Btn>
          <Btn onClick={onEnter} size="sm">Get started →</Btn>
        </div>
      </nav>

      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 40px 60px", position: "relative" }}>
        <Orbs />
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(59,110,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,110,248,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, zIndex: 1, animation: "fadeUp 0.8s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,110,248,0.1)", border: "1px solid rgba(59,110,248,0.25)", borderRadius: 100, padding: "6px 16px 6px 10px", marginBottom: 28 }}>
            <LiveDot color={T.green} />&nbsp;
            <span style={{ fontSize: 12, color: "#93C5FD", fontWeight: 600, letterSpacing: "0.04em" }}>AI RECRUITMENT PLATFORM · LIVE</span>
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(42px,6vw,78px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: 22,
          }}>
            Find the right<br />talent{' '}
            <span style={{
              background: "linear-gradient(135deg,#3B6EF8,#8B5CF6,#22D3EE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(59,110,248,0.4))",
            }}>faster with AI</span>
          </h1>
          <p style={{ fontSize: 18, color: T.textMid, lineHeight: 1.75, marginBottom: 36, maxWidth: 520 }}>
            Resume analysis, semantic job matching, and candidate shortlisting — automated end-to-end by AI so you can focus on the humans, not the haystack.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
            <Btn onClick={onEnter} size="lg">Start for free →</Btn>
            <Btn variant="ghost" size="lg" style={{ border: `1px solid ${T.border}` }}>▶ Watch 2-min demo</Btn>
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            {[["50K+","Job seekers"],["8K+","Companies"],["94%","Match accuracy"],["3×","Faster hiring"]].map(([n, l]) => (
              <div key={l} style={{ animation: "fadeUp 0.8s ease both" }}>
                <div style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  background: T.grad2,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{n}</div>
                <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", minHeight: 520, display: "flex", justifyContent: "center", zIndex: 1 }}>
          <div style={{ position: "absolute", top: "0%", right: "0%", animation: "floatY 5s ease-in-out infinite" }}>
            <GlassPane style={{ padding: 20, width: 300, border: `1px solid rgba(59,110,248,0.25)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: T.grad1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk',sans-serif" }}>AI Match Engine</div>
                  <div style={{ fontSize: 11, color: T.textMid, display: "flex", alignItems: "center", gap: 4 }}><LiveDot color={T.green} /> Scanning 12,400 roles</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Ring val={94} size={72} color={T.green} label="Google" sublabel="Python Dev" />
                <Ring val={91} size={72} color={T.violet} label="Microsoft" sublabel="Backend" />
                <Ring val={89} size={72} color={T.cyan} label="Amazon" sublabel="SWE" />
              </div>
            </GlassPane>
          </div>

          <div style={{ position: "absolute", top: "42%", right: "12%", animation: "floatY 6s ease-in-out infinite", animationDelay: "1s" }}>
            <GlassPane style={{ padding: 16, width: 240, border: `1px solid rgba(34,211,238,0.2)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "#4285F4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: "#fff",
                  fontSize: 16,
                }}>G</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Google</div>
                  <div style={{ fontSize: 11, color: T.textMid }}>Python Developer · Remote</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Pill label="94% AI Match" color={T.green} />
                <span style={{ fontSize: 11, color: T.textDim }}>$130–160k</span>
              </div>
            </GlassPane>
          </div>

          <div style={{ position: "absolute", top: "22%", left: "5%", animation: "floatY 7s ease-in-out infinite", animationDelay: "0.5s" }}>
            <GlassPane style={{ padding: 16, width: 210, border: `1px solid rgba(139,92,246,0.25)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 50,
                  background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: 13,
                }}>RS</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Rahul Shah</div>
                  <div style={{ fontSize: 11, color: T.textMid }}>Python Developer</div>
                </div>
              </div>
              <div style={{
                background: "rgba(59,110,248,0.12)",
                borderRadius: 8,
                padding: "7px 10px",
                fontSize: 12,
                display: "flex",
                justifyContent: "space-between",
              }}>
                <span style={{ color: "#93C5FD" }}>⭐ AI Score</span>
                <span style={{ fontWeight: 700 }}>87 / 100</span>
              </div>
            </GlassPane>
          </div>

          <div style={{ position: "absolute", bottom: "8%", left: "8%", animation: "floatY 5.5s ease-in-out infinite", animationDelay: "2s" }}>
            <GlassPane style={{ padding: 16, width: 200, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, color: T.textMid, marginBottom: 10, fontWeight: 600, letterSpacing: "0.06em" }}>WEEKLY APPLICATIONS</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 48 }}>
                {[35, 55, 40, 70, 60, 88, 65].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: "3px 3px 0 0",
                      background: i === 5 ? T.grad1 : "rgba(59,110,248,0.18)",
                      boxShadow: i === 5 ? "0 0 8px rgba(59,110,248,0.4)" : "none",
                      transition: "height 0.5s",
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "#93C5FD" }}>247</span>
                <Pill label="+14%" color={T.green} />
              </div>
            </GlassPane>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 40px", background: "rgba(9,13,26,0.6)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(59,110,248,0.3),transparent)" }} />
        <div style={{ textAlign: "center", marginBottom: 64, animation: "fadeUp 0.6s ease both" }}>
          <Pill label="CAPABILITIES" color={T.cyan} />
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(28px,4vw,46px)",
            fontWeight: 700,
            letterSpacing: "-1px",
            marginTop: 16,
            marginBottom: 12,
          }}>Everything to hire smarter</h2>
          <p style={{ color: T.textMid, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Six AI modules that replace a full recruitment team.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { icon: "🧠", title: "AI Resume Analysis", desc: "Extract skills, experience, certs in 3 seconds. Get ATS scores and ranked improvement actions.", color: T.blue },
            { icon: "🎯", title: "Semantic Job Matching", desc: "94%+ accuracy via NLP vector embeddings. Goes beyond keywords to match intent.", color: T.violet },
            { icon: "🧪", title: "Smart Screening Tests", desc: "Auto-graded aptitude, technical, and coding tests with instant candidate ranking.", color: T.cyan },
            { icon: "🗺️", title: "AI Career Roadmap", desc: "Personalized path from now to target role — with skill gaps, timelines, and courses.", color: T.green },
            { icon: "📊", title: "Deep Analytics", desc: "Hiring funnels, match trends, skill demand heatmaps, recruiter performance.", color: T.amber },
            { icon: "🤖", title: "AI Chat Coach", desc: "Instant resume review, job recs, and career guidance from your always-on AI coach.", color: T.rose },
          ].map((f, i) => (
            <GlassPane key={f.title} hover style={{ padding: 28, animation: `fadeUp 0.6s ${i * 0.08}s ease both` }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: f.color + "18",
                border: `1px solid ${f.color}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                marginBottom: 16,
                boxShadow: `0 0 20px ${f.color}18`,
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: T.textMid, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
            </GlassPane>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 40px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)" }} />
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Pill label="PROCESS" color={T.violet} />
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(28px,4vw,46px)",
            fontWeight: 700,
            letterSpacing: "-1px",
            marginTop: 16,
          }}>From profile to hired</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0, maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {["Create Profile","Upload Resume","AI Analysis","Job Matching","Screening Test","Candidate Ranking","Connect","Get Hired"].map((s, i, arr) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 0, margin: "8px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 12px" }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 50,
                  background: i === arr.length - 1 ? T.grad3 : i === 0 ? "rgba(59,110,248,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i === arr.length - 1 ? "transparent" : i === 0 ? T.blue : T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  color: i === arr.length - 1 ? "#fff" : i === 0 ? T.blue : T.textDim,
                  boxShadow: i === arr.length - 1 ? "0 0 20px rgba(244,63,94,0.4)" : i === 0 ? "0 0 16px rgba(59,110,248,0.3)" : "none",
                }}>{i === arr.length - 1 ? "🎉" : i + 1}</div>
                <span style={{ fontSize: 12, color: i === 0 || i === arr.length - 1 ? T.text : T.textMid, fontWeight: i === 0 || i === arr.length - 1 ? 600 : 400, textAlign: "center", maxWidth: 80 }}>{s}</span>
              </div>
              {i < arr.length - 1 && <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,${T.blue}44,${T.violet}44)`, marginBottom: 22 }} />}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 40px", textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(59,110,248,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <Pill label="GET STARTED" color={T.blue} />
        <h2 style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: "clamp(30px,4vw,52px)",
          fontWeight: 700,
          letterSpacing: "-1.5px",
          margin: "20px auto 16px",
          maxWidth: 600,
        }}>
          Transform your hiring today.
        </h2>
        <p style={{ color: T.textMid, fontSize: 16, marginBottom: 36 }}>Join 50,000+ job seekers and 8,000+ companies already inside.</p>
        <Btn onClick={onEnter} size="lg" style={{ animation: "glow 2s ease-in-out infinite" }}>Create free account →</Btn>
      </section>

      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "24px 40px", display: "flex", justifyContent: "space-between", color: T.textDim, fontSize: 12 }}>
        <span>© 2025 Jobsi AI. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span
              key={l}
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.textMid)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}
            >
              {l}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

function Auth({ onAuth }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focus, setFocus] = useState(null);

  const inputStyle = (k) => ({
    width: "100%",
    padding: "12px 12px 12px 42px",
    background: "rgba(9,13,26,0.8)",
    border: `1px solid ${focus === k ? "rgba(59,110,248,0.5)" : T.border}`,
    borderRadius: 10,
    color: T.text,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  return (
    <div style={{ minHeight: "100vh", background: T.bg0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", color: T.text, position: "relative", overflow: "hidden" }}>
      <style>{GLOBAL_CSS}</style>
      <Orbs />
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(59,110,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,110,248,0.03) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440, padding: "0 20px", zIndex: 1, animation: "fadeUp 0.6s ease both" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: T.grad1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 900,
            margin: "0 auto 16px",
            color: "#fff",
            boxShadow: "0 0 30px rgba(59,110,248,0.5)",
          }}>J</div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6 }}>
            {step === 1 ? "Create your account" : "Choose your role"}
          </h1>
          <p style={{ color: T.textMid, fontSize: 14 }}>{step === 1 ? "Start your AI career journey" : "Personalize your Jobsi experience"}</p>
        </div>

        <GlassPane style={{ padding: 28, border: `1px solid ${T.borderMid}` }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Full Name", "name", "text", "👤"], ["Email Address", "email", "email", "✉️"], ["Password", "password", "password", "🔒"]].map(([label, key, type, icon]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: T.textMid, marginBottom: 6, display: "block", fontWeight: 500, letterSpacing: "0.04em" }}>{label.toUpperCase()}</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>{icon}</span>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      onFocus={() => setFocus(key)}
                      onBlur={() => setFocus(null)}
                      style={inputStyle(key)}
                      placeholder={label}
                    />
                  </div>
                </div>
              ))}
              <Btn onClick={() => setStep(2)} style={{ width: "100%", padding: "13px", marginTop: 4, fontSize: 15 }}>Continue →</Btn>
              <div style={{ position: "relative", textAlign: "center", margin: "4px 0" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: T.border }} />
                <span style={{ background: T.bg2, padding: "0 12px", fontSize: 12, color: T.textDim, position: "relative" }}>OR CONTINUE WITH</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["G", "Google"], ["⬛", "GitHub"], ["in", "LinkedIn"]].map(([icon, name]) => (
                  <button
                    key={name}
                    onClick={onAuth}
                    style={{
                      flex: 1,
                      padding: "10px 6px",
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      color: T.textMid,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = T.borderMid;
                      e.currentTarget.style.color = T.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.color = T.textMid;
                    }}
                  >
                    {icon} {name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { id: "seeker", icon: "🎓", title: "Job Seeker", desc: "Find your dream role with AI matching" },
                  { id: "company", icon: "🏢", title: "Recruiter", desc: "Discover top talent 3× faster" },
                ].map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      padding: 20,
                      borderRadius: 14,
                      cursor: "pointer",
                      textAlign: "center",
                      border: `1px solid ${role === r.id ? T.blue : T.border}`,
                      background: role === r.id ? "rgba(59,110,248,0.1)" : "rgba(255,255,255,0.02)",
                      boxShadow: role === r.id ? "0 0 24px rgba(59,110,248,0.2)" : "none",
                      transition: "all 0.25s",
                      transform: role === r.id ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{r.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk',sans-serif" }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: T.textMid, marginTop: 6, lineHeight: 1.5 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
              <Btn
                onClick={onAuth}
                style={{ width: "100%", padding: "13px", fontSize: 15, opacity: role ? 1 : 0.45 }}
              >
                {role ? `Join as ${role === "seeker" ? "Job Seeker" : "Recruiter"} →` : "Select a role"}
              </Btn>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <span style={{ color: T.textDim, fontSize: 13, cursor: "pointer" }} onClick={() => setStep(1)}>← Back</span>
              </div>
            </div>
          )}
        </GlassPane>
        <p style={{ textAlign: "center", marginTop: 20, color: T.textDim, fontSize: 13 }}>
          Already have an account?{' '}
          <span style={{ color: T.blue, cursor: "pointer", fontWeight: 600 }} onClick={onAuth}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

function AppShell({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([{ from: "ai", text: "Hey Rahul! I'm your AI Career Coach. Ask me about your resume, job matches, interview prep — anything career-related 🚀" }]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const navTo = (id) => {
    setActive(id);
    setOpen(false);
  };

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    const msg = chatMsg.trim();
    setChatMsg("");
    setChatHistory((h) => [...h, { from: "user", text: msg }]);
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are Jobsi AI Career Coach, expert in career development, resume optimization, job searching for software engineers. Be concise (2-3 sentences), warm, and actionable. Address the user as Rahul occasionally.",
          messages: [...chatHistory.filter((m) => m.from === "user").map((m) => ({ role: "user", content: m.text })), { role: "user", content: msg }],
        }),
      });
      const d = await res.json();
      setChatHistory((h) => [...h, { from: "ai", text: d.content?.[0]?.text || "Let me help with that!" }]);
    } catch {
      setChatHistory((h) => [...h, { from: "ai", text: "Hmm, something went wrong. Try again!" }]);
    }
    setAiLoading(false);
  };

  const activeLabel = NAV.find((n) => n.id === active)?.label || "Dashboard";
  const unreadCount = NOTIFS.filter((n) => n.unread).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.bg0, color: T.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      <header style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "rgba(5,7,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: `1px solid ${open ? T.borderHi : T.border}`,
              background: open ? "rgba(59,110,248,0.15)" : "rgba(255,255,255,0.03)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              cursor: "pointer",
              padding: 0,
              transition: "all 0.2s",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 1 ? 14 : 18,
                  height: 2,
                  borderRadius: 2,
                  background: open ? T.blue : T.textMid,
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  transform: open && i === 0 ? "rotate(45deg) translate(4px,4px)" : open && i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.grad1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "#fff",
              boxShadow: "0 0 14px rgba(59,110,248,0.4)",
            }}>J</div>
            <span style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg,#93C5FD,#C4B5FD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Jobsi</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.textDim }}>
            <span style={{ color: T.textDim }}>/</span>
            <span style={{ color: T.text, fontWeight: 500 }}>{activeLabel}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "8px 14px",
            width: 220,
          }}>
            <span style={{ color: T.textDim, fontSize: 14 }}>🔍</span>
            <input
              placeholder="Search jobs, skills..."
              style={{
                background: "none",
                border: "none",
                color: T.text,
                fontSize: 13,
                outline: "none",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            onClick={() => navTo("notifications")}
            style={{
              position: "relative",
              width: 38,
              height: 38,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.borderMid;
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          >🔔
            {unreadCount > 0 && (
              <div style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 17,
                height: 17,
                background: T.rose,
                borderRadius: "50%",
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                border: "2px solid #05070F",
              }}>{unreadCount}</div>
            )}
          </button>

          <div style={{
            width: 36,
            height: 36,
            borderRadius: 50,
            background: "linear-gradient(135deg,#3B6EF8,#8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            border: "2px solid rgba(59,110,248,0.4)",
            boxShadow: "0 0 14px rgba(59,110,248,0.3)",
          }}>RS</div>
        </div>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 149,
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 264,
        zIndex: 150,
        background: "rgba(7,10,20,0.98)",
        backdropFilter: "blur(24px)",
        borderRight: `1px solid ${T.borderMid}`,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}>
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: T.grad1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
              boxShadow: "0 0 18px rgba(59,110,248,0.4)",
            }}>J</div>
            <span style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg,#93C5FD,#C4B5FD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Jobsi</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 50,
            background: "linear-gradient(135deg,#3B6EF8,#8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 15,
            border: "2px solid rgba(59,110,248,0.35)",
            flexShrink: 0,
          }}>RS</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Rahul Shah</div>
            <div style={{ fontSize: 12, color: T.textMid, display: "flex", alignItems: "center", gap: 5 }}><LiveDot color={T.green} /> Python Developer</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          <div style={{
            fontSize: 10,
            color: T.textDim,
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "6px 12px 8px",
          }}>MAIN MENU</div>
          {NAV.map((item, i) => {
            const isActive = active === item.id;
            return (
              <div
                key={item.id}
                onClick={() => navTo(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: isActive ? "rgba(59,110,248,0.15)" : "transparent",
                  color: isActive ? T.blue : T.textMid,
                  marginBottom: 2,
                  transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                  animation: `slideRight 0.35s ${i * 0.04}s ease both`,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = T.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = T.textMid;
                  }
                }}
              >
                {isActive && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: 3, background: T.grad1 }} />}
                <span style={{ fontSize: 18, flexShrink: 0, filter: isActive ? "none" : "grayscale(30%)" }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                {item.id === "notifications" && unreadCount > 0 && (
                  <span style={{
                    marginLeft: "auto",
                    background: T.rose,
                    borderRadius: 20,
                    padding: "1px 7px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                  }}>{unreadCount}</span>
                )}
                {item.id === "jobs" && (
                  <span style={{
                    marginLeft: "auto",
                    background: "rgba(59,110,248,0.3)",
                    borderRadius: 20,
                    padding: "1px 7px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#93C5FD",
                  }}>5</span>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 12,
              cursor: "pointer",
              color: "#F87171",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244,63,94,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Logout</span>
          </div>
        </div>
      </div>

      <main style={{
        flex: 1,
        padding: "28px 32px",
        overflowY: "auto",
        background: `linear-gradient(160deg,${T.bg1} 0%,${T.bg0} 100%)`,
        minHeight: 0,
      }}>
        <PageContent active={active} />
      </main>

      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200 }}>
        {chatOpen && (
          <div style={{
            width: 360,
            marginBottom: 14,
            background: "rgba(7,10,20,0.97)",
            border: `1px solid rgba(59,110,248,0.35)`,
            borderRadius: 18,
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            animation: "fadeUp 0.25s ease",
          }}>
            <div style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg,rgba(59,110,248,0.25),rgba(139,92,246,0.2))",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: T.grad1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 0 14px rgba(59,110,248,0.4)",
                }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk',sans-serif" }}>Jobsi AI Coach</div>
                  <div style={{ fontSize: 11, color: "#86EFAC", display: "flex", alignItems: "center", gap: 4 }}><LiveDot color={T.green} /> Online · powered by Claude</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <div style={{ height: 300, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.2s ease" }}>
                  {m.from === "ai" && (
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: T.grad1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                      marginRight: 8,
                      alignSelf: "flex-end",
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: m.from === "user" ? T.grad1 : "rgba(255,255,255,0.05)",
                    color: T.text,
                    border: m.from === "ai" ? `1px solid ${T.border}` : "none",
                  }}>{m.text}</div>
                </div>
              ))}
              {aiLoading && (
                <div style={{
                  display: "flex",
                  gap: 4,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px 14px 14px 4px",
                  width: 64,
                  border: `1px solid ${T.border}`,
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 6,
                      height: 6,
                      background: T.textDim,
                      borderRadius: "50%",
                      animation: `bounce 1s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: "8px 14px", display: "flex", gap: 6, overflowX: "auto", borderTop: `1px solid ${T.border}` }}>
              {["Review my resume", "Top job matches", "Interview tips"].map((p) => (
                <button
                  key={p}
                  onClick={() => setChatMsg(p)}
                  style={{
                    background: "rgba(59,110,248,0.1)",
                    border: `1px solid rgba(59,110,248,0.25)`,
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 11,
                    color: "#93C5FD",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask your AI coach..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "9px 13px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <Btn onClick={sendChat} size="sm" style={{ padding: "9px 16px", flexShrink: 0 }}>→</Btn>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen((v) => !v)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 50,
            background: T.grad1,
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 6px rgba(59,110,248,0.15), 0 8px 32px rgba(59,110,248,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            animation: "glow 3s ease-in-out infinite",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {chatOpen ? "✕" : "🤖"}
        </button>
      </div>
    </div>
  );
}

function PageContent({ active }) {
  const map = {
    dashboard: <DashHome />,
    profile: <ProfilePage />,
    resume: <ResumePage />,
    jobs: <JobsPage />,
    applications: <AppsPage />,
    tests: <TestsPage />,
    skills: <SkillsPage />,
    roadmap: <RoadmapPage />,
    notifications: <NotifsPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
    messages: <MessagesPage />,
  };
  return <div style={{ animation: "fadeUp 0.35s ease both" }}>{map[active] || <DashHome />}</div>;
}

function DashHome() {
  const kpis = [
    { icon: "⚡", label: "AI Employability", val: 87, color: T.blue },
    { icon: "💪", label: "Profile Strength", val: 72, color: T.violet },
    { icon: "✅", label: "Skills Verified", val: 70, color: T.cyan },
    { icon: "🎯", label: "Job Matches", val: 46, color: T.green },
    { icon: "📋", label: "Applications", val: 40, color: T.amber },
    { icon: "🧪", label: "Tests Ready", val: 80, color: T.rose },
  ];
  const actualVals = [87, 72, 14, 23, 8, 4];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          marginBottom: 4,
        }}>Welcome back, Rahul 👋</h2>
        <p style={{ color: T.textMid, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><LiveDot color={T.green} /> AI job scanner active · 3 new matches today</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
        {kpis.map((k, i) => (
          <GlassPane key={k.label} hover style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, animation: `fadeUp 0.4s ${i * 0.07}s ease both` }}>
            <Ring val={k.val} size={58} stroke={5} color={k.color} />
            <div>
              <div style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: k.color,
                lineHeight: 1,
              }}>
                <Counter end={actualVals[i]} suffix={i < 2 || i === 4 || i === 5 ? "" : ""} />
                {i < 2 ? "%" : ""}
              </div>
              <div style={{ fontSize: 12, color: T.textMid, marginTop: 3, lineHeight: 1.4 }}>{k.label}</div>
            </div>
          </GlassPane>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <GlassPane style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16 }}>AI Job Matches</div>
            <Pill label="Live" color={T.green} />
          </div>
          {JOBS.slice(0, 4).map((j, i) => (
            <div key={j.company + j.role} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 0",
              borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: j.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#fff",
                fontSize: 17,
                flexShrink: 0,
                boxShadow: `0 0 12px ${j.color}44`,
              }}>{j.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{j.role}</div>
                <div style={{ color: T.textMid, fontSize: 13, marginTop: 2 }}>{j.company} · {j.type}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: j.match >= 90 ? T.green : j.match >= 85 ? T.amber : T.blue }}>{j.match}%</div>
                <div style={{ fontSize: 11, color: T.textDim }}>match</div>
              </div>
            </div>
          ))}
        </GlassPane>

        <GlassPane style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16 }}>Alerts</div>
            <Pill label={`${NOTIFS.filter((n) => n.unread).length} new`} color={T.rose} />
          </div>
          {NOTIFS.map((n, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 10,
              padding: "10px 0",
              borderBottom: i < NOTIFS.length - 1 ? `1px solid ${T.border}` : "none",
              opacity: n.unread ? 1 : 0.6,
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: n.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: n.unread ? T.text : T.textMid,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>{n.title}</div>
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </GlassPane>
      </div>

      <GlassPane style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16 }}>Applications this week</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: "#93C5FD" }}><Counter end={247} /></div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
            const vals = [3, 7, 5, 12, 8, 14, 9];
            const max = 14;
            const pct = (vals[i] / max) * 100;
            const hot = i === 5;
            return (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, color: hot ? T.blue : T.textMid, fontWeight: hot ? 700 : 400 }}>{vals[i]}</div>
                <div style={{
                  width: "100%",
                  background: hot ? T.grad1 : "rgba(255,255,255,0.05)",
                  borderRadius: "4px 4px 0 0",
                  height: `${pct}%`,
                  transition: "height 1s cubic-bezier(.4,0,.2,1)",
                  boxShadow: hot ? "0 0 12px rgba(59,110,248,0.5)" : "none",
                }} />
                <div style={{ fontSize: 11, color: T.textDim }}>{d}</div>
              </div>
            );
          })}
        </div>
      </GlassPane>
    </div>
  );
}

function ProfilePage() {
  const skills = ["Python","React.js","Node.js","SQL","Machine Learning","Docker","AWS","TypeScript","FastAPI","Git","PostgreSQL","Redis"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>My Profile</h2>
        <Btn size="sm">Save changes</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <GlassPane style={{ padding: 24, textAlign: "center", border: `1px solid ${T.borderMid}` }}>
            <div style={{
              width: 88,
              height: 88,
              borderRadius: 50,
              margin: "0 auto 14px",
              background: "linear-gradient(135deg,#3B6EF8,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 32,
              border: "3px solid rgba(59,110,248,0.5)",
              boxShadow: "0 0 30px rgba(59,110,248,0.35)",
            }}>RS</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Rahul Shah</div>
            <div style={{ color: T.textMid, fontSize: 13, marginBottom: 4 }}>Python Developer</div>
            <div style={{ color: T.textDim, fontSize: 12, marginBottom: 16 }}>📍 Bangalore, India</div>
            <Ring val={72} size={72} color={T.violet} label="Profile strength" />
          </GlassPane>
          <GlassPane style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: T.textMid, letterSpacing: "0.06em" }}>LINKS</div>
            {[["🐙","github.com/rahul"],["💼","linkedin.com/in/rahul"],["🌐","rahulshah.dev"],["📄","Resume PDF"]].map(([icon, url]) => (
              <div key={url} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 0",
                borderBottom: `1px solid ${T.border}`,
                fontSize: 13,
                color: T.textMid,
                cursor: "pointer",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.currentTarget.style.color = T.text} onMouseLeave={(e) => e.currentTarget.style.color = T.textMid}>
                <span>{icon}</span>
                <span style={{ flex: 1 }}>{url}</span>
                <span style={{ color: T.blue }}>↗</span>
              </div>
            ))}
          </GlassPane>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <GlassPane style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>Personal Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Full Name","Rahul Shah"],["Email","rahul@example.com"],["Phone","+91 98765 43210"],["Location","Bangalore, India"],["Experience","3 Years"],["Availability","Immediate"]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, color: T.textDim, letterSpacing: "0.06em", marginBottom: 4 }}>{l.toUpperCase()}</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
          </GlassPane>
          <GlassPane style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, fontFamily: "'Space Grotesk',sans-serif" }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skills.map((s) => <Pill key={s} label={s} color={T.blue} />)}
              <span style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px dashed ${T.border}`,
                borderRadius: 6,
                padding: "3px 12px",
                fontSize: 12,
                color: T.textDim,
                cursor: "pointer",
              }}>+ Add</span>
            </div>
          </GlassPane>
          <GlassPane style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>Work Experience</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(59,110,248,0.15)",
                  border: `1px solid rgba(59,110,248,0.25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}>💼</div>
                <div style={{ flex: 1, width: 1, background: `linear-gradient(${T.blue}44,transparent)`, marginTop: 8 }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Python Backend Developer</div>
                <div style={{ color: T.textMid, fontSize: 13, marginTop: 2 }}>Infosys Ltd. · Bangalore</div>
                <div style={{ color: T.textDim, fontSize: 12, marginTop: 2, marginBottom: 10 }}>Jan 2022 – Present</div>
                <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7 }}>Built scalable microservices using FastAPI and Django, improving system throughput by 40%. Led migration of legacy systems to cloud-native architecture on AWS serving 2M+ users.</p>
              </div>
            </div>
          </GlassPane>
        </div>
      </div>
    </div>
  );
}

function ResumePage() {
  const [state, setState] = useState("idle");

  const analyze = async () => {
    setState("analyzing");
    await new Promise((r) => setTimeout(r, 2400));
    setState("done");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>AI Resume Analysis</h2>

      {state === "idle" && (
        <GlassPane style={{ padding: 60, textAlign: "center", border: `2px dashed rgba(59,110,248,0.25)` }}>
          <div style={{ fontSize: 64, marginBottom: 16, animation: "floatY 4s ease-in-out infinite" }}>📄</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Drop your resume here</div>
          <div style={{ color: T.textMid, fontSize: 14, marginBottom: 28 }}>PDF, DOCX, or TXT · max 10 MB</div>
          <Btn size="lg" onClick={analyze}>Upload & Analyze →</Btn>
        </GlassPane>
      )}

      {state === "analyzing" && (
        <GlassPane style={{ padding: 48, textAlign: "center" }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 50,
            background: T.grad1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 20px",
            animation: "spinSlow 2s linear infinite",
          }}>🤖</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>AI is analyzing your resume…</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            {["Extracting skills", "Scoring ATS", "Generating tips"].map((s, i) => (
              <div key={s} style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: T.textMid,
                animation: `fadeIn 0.4s ${i * 0.4}s ease both`,
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `2px solid ${T.blue} transparent`,
                  animation: "spinSlow 1s linear infinite",
                }} />
                {s}
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 4, overflow: "hidden", maxWidth: 400, margin: "0 auto" }}>
            <div style={{ height: "100%", background: T.grad1, borderRadius: 100, animation: "typeWrite 2.4s linear", width: "80%" }} />
          </div>
        </GlassPane>
      )}

      {state === "done" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[["Resume Score", 88, T.blue], ["ATS Score", 76, T.violet], ["Keyword Match", 82, T.cyan]].map(([l, v, c]) => (
              <GlassPane key={l} style={{ padding: 24, textAlign: "center", border: `1px solid ${c}22` }}>
                <Ring val={v} size={90} stroke={7} color={c} />
                <div style={{ fontWeight: 600, marginTop: 14, fontSize: 14 }}>{l}</div>
              </GlassPane>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <GlassPane style={{ padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, fontFamily: "'Space Grotesk',sans-serif", color: T.green }}>✓ Extracted Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {[
                  "Python",
                  "Django",
                  "FastAPI",
                  "PostgreSQL",
                  "AWS",
                  "Docker",
                  "React.js",
                  "REST APIs",
                  "Git",
                  "Linux",
                  "CI/CD",
                ].map((s) => <Pill key={s} label={s} color={T.green} />)}
              </div>
            </GlassPane>
            <GlassPane style={{ padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, fontFamily: "'Space Grotesk',sans-serif", color: T.rose }}>✗ Missing Keywords</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {[
                  "Kubernetes",
                  "Microservices",
                  "GraphQL",
                  "Redis",
                  "Kafka",
                  "System Design",
                  "Terraform",
                ].map((s) => <Pill key={s} label={s} color={T.rose} />)}
              </div>
            </GlassPane>
          </div>
          <GlassPane style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>🤖 AI Improvement Suggestions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "⚡", text: "Add quantified results — '40% throughput improvement' is stronger than 'improved performance'.", pri: "High", color: T.rose },
                { icon: "🎯", text: "Add Kubernetes & microservices — they appear in 78% of your target job descriptions.", pri: "High", color: T.rose },
                { icon: "📊", text: "Include a Projects section with 2–3 GitHub links and impact metrics.", pri: "Medium", color: T.amber },
                { icon: "✏️", text: "Replace passive verbs with action verbs: 'architected', 'optimized', 'automated'.", pri: "Medium", color: T.amber },
              ].map((tip, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 12,
                  alignItems: "flex-start",
                  border: `1px solid ${tip.color}18`,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.icon}</span>
                  <span style={{ fontSize: 13, color: T.textMid, flex: 1, lineHeight: 1.6 }}>{tip.text}</span>
                  <Pill label={tip.pri} color={tip.color} />
                </div>
              ))}
            </div>
          </GlassPane>
        </div>
      )}
    </div>
  );
}

function JobsPage() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? JOBS : JOBS.filter((j) => j.match >= 90);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>AI Job Matches</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[["all","All Matches"],["90+","90%+ Match"]].map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: `1px solid ${filter === f ? T.blue : T.border}`,
                background: filter === f ? "rgba(59,110,248,0.15)" : "rgba(255,255,255,0.03)",
                color: filter === f ? "#93C5FD" : T.textMid,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((j, i) => (
          <GlassPane key={j.company + j.role} hover style={{ padding: 20, display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 18, alignItems: "center", animation: `fadeUp 0.35s ${i * 0.07}s ease both` }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: j.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 22,
              boxShadow: `0 0 16px ${j.color}55`,
            }}>{j.logo}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{j.role}</div>
              <div style={{ color: T.textMid, fontSize: 13, marginBottom: 10 }}>{j.company} · {j.type} · {j.salary}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {j.skills.map((s) => <Pill key={s} label={s} color={T.cyan} />)}
                {j.missing.map((s) => <Pill key={s} label={`Missing: ${s}`} color={T.rose} />)}
              </div>
            </div>
            <Ring val={j.match} size={70} stroke={6} color={j.match >= 90 ? T.green : j.match >= 85 ? T.amber : T.blue} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn size="sm">Apply →</Btn>
              <Btn variant="ghost" size="sm" style={{ border: `1px solid ${T.border}` }}>Save</Btn>
            </div>
          </GlassPane>
        ))}
      </div>
    </div>
  );
}

function AppsPage() {
  const apps = [
    { company: "Google", role: "Python Developer", date: "Jun 18", status: "Screening", logo: "G", color: "#4285F4" },
    { company: "Microsoft", role: "Backend Developer", date: "Jun 15", status: "Shortlisted", logo: "M", color: "#00A4EF" },
    { company: "Flipkart", role: "Software Engineer", date: "Jun 10", status: "Applied", logo: "F", color: "#F97316" },
    { company: "Swiggy", role: "Backend Engineer", date: "Jun 8", status: "Rejected", logo: "S", color: T.rose },
    { company: "Atlassian", role: "Cloud Engineer", date: "Jun 5", status: "Applied", logo: "A", color: "#0052CC" },
  ];
  const statusMap = { Applied: { color: T.cyan }, Screening: { color: T.amber }, Shortlisted: { color: T.green }, Rejected: { color: T.rose } };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Applications</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(statusMap).map(([s, { color }]) => (
            <Pill key={s} label={`${apps.filter((a) => a.status === s).length} ${s}`} color={color} />
          ))}
        </div>
      </div>
      <GlassPane style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {['Company', 'Role', 'Applied', 'Status', 'Action'].map((h) => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 12, letterSpacing: "0.06em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apps.map((a, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < apps.length - 1 ? `1px solid ${T.border}` : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: a.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: 14,
                    }}>{a.logo}</div>
                    <span style={{ fontWeight: 500 }}>{a.company}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", color: T.textMid }}>{a.role}</td>
                <td style={{ padding: "14px 20px", color: T.textDim, fontSize: 13 }}>{a.date}</td>
                <td style={{ padding: "14px 20px" }}><Pill label={a.status} color={statusMap[a.status].color} /></td>
                <td style={{ padding: "14px 20px" }}><Btn variant="ghost" size="sm" style={{ border: `1px solid ${T.border}` }}>View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPane>
    </div>
  );
}

function TestsPage() {
  const tests = [
    { title: "Python Advanced", company: "Google", dur: "45 min", q: 30, diff: "Hard", cat: "Technical", color: T.blue },
    { title: "DSA — Coding Round", company: "Amazon", dur: "60 min", q: 25, diff: "Hard", cat: "Coding", color: T.violet },
    { title: "System Design", company: "Microsoft", dur: "90 min", q: 10, diff: "Expert", cat: "Technical", color: T.rose },
    { title: "Aptitude & Reasoning", company: "TCS", dur: "30 min", q: 40, diff: "Medium", cat: "Aptitude", color: T.amber },
  ];
  const diffColor = { Medium: T.amber, Hard: T.rose, Expert: T.violet };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Screening Tests</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {tests.map((t, i) => (
          <GlassPane key={t.title} hover style={{ padding: 22, border: `1px solid ${t.color}18`, animation: `fadeUp 0.35s ${i * 0.08}s ease both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <Pill label={t.cat} color={t.color} />
              <Pill label={t.diff} color={diffColor[t.diff]} />
            </div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{t.title}</div>
            <div style={{ color: T.textMid, fontSize: 13, marginBottom: 14 }}>Invited by {t.company}</div>
            <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: T.textDim }}>⏱ {t.dur}</div>
              <div style={{ fontSize: 13, color: T.textDim }}>📝 {t.q} questions</div>
            </div>
            <Btn style={{ width: "100%", padding: "10px", background: `linear-gradient(135deg,${t.color},${t.color}99)` }}>Start Test →</Btn>
          </GlassPane>
        ))}
      </div>
    </div>
  );
}

function SkillsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Skill Gap Analysis</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <GlassPane style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, fontFamily: "'Space Grotesk',sans-serif" }}>Your Skills vs Job Requirements</div>
          {SKILLS.map((s, i) => (
            <div key={s.label} style={{ marginBottom: 16, animation: `fadeUp 0.35s ${i * 0.06}s ease both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: T.textDim }}>{s.have}% <span style={{ color: T.textDim }}>/ {s.need}% req</span></span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 7, position: "relative" }}>
                <div style={{ position: "absolute", width: `${s.need}%`, height: "100%", background: "rgba(255,255,255,0.08)", borderRadius: 100 }} />
                <div style={{
                  height: "100%",
                  width: `${s.have}%`,
                  background: s.have >= s.need ? T.green : s.have >= s.need - 15 ? T.amber : T.rose,
                  borderRadius: 100,
                  transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
                  boxShadow: `0 0 8px ${s.color}55`,
                }} />
              </div>
            </div>
          ))}
        </GlassPane>
        <GlassPane style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, fontFamily: "'Space Grotesk',sans-serif" }}>Recommended Courses</div>
          {[
            { skill: "Machine Learning", platform: "Coursera", dur: "3 months", icon: "🤖", color: T.violet },
            { skill: "System Design", platform: "Educative.io", dur: "6 weeks", icon: "🏗️", color: T.blue },
            { skill: "Docker & Kubernetes", platform: "Udemy", dur: "4 weeks", icon: "🐳", color: T.cyan },
            { skill: "Kafka & Redis", platform: "Pluralsight", dur: "3 weeks", icon: "⚡", color: T.amber },
          ].map((r, i) => (
            <div key={r.skill} style={{
              display: "flex",
              gap: 12,
              padding: 12,
              background: "rgba(255,255,255,0.02)",
              borderRadius: 12,
              marginBottom: 10,
              border: `1px solid ${r.color}15`,
              animation: `fadeUp 0.35s ${i * 0.07}s ease both`,
            }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: r.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.skill}</div>
                <div style={{ fontSize: 12, color: T.textMid }}>{r.platform} · {r.dur}</div>
              </div>
              <Btn variant="ghost" size="sm" style={{ border: `1px solid ${T.border}`, alignSelf: "center" }}>Enroll</Btn>
            </div>
          ))}
        </GlassPane>
      </div>
    </div>
  );
}

function RoadmapPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Career Roadmap</h2>
        <p style={{ color: T.textMid, fontSize: 14 }}>Your personalized path to Solution Architect · estimated 4 years</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 700 }}>
        {ROADMAP.map((step, i) => (
          <div key={step.title} style={{ display: "flex", gap: 20, animation: `fadeUp 0.4s ${i * 0.1}s ease both` }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 50,
                background: step.current ? T.grad1 : "rgba(255,255,255,0.04)",
                border: `2px solid ${step.current ? "transparent" : T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 15,
                color: step.current ? "#fff" : T.textDim,
                boxShadow: step.current ? "0 0 20px rgba(59,110,248,0.5)" : "none",
                transition: "all 0.3s",
              }}>{step.current ? "✦" : i + 1}</div>
              {i < ROADMAP.length - 1 && <div style={{ width: 2, height: 56, background: `linear-gradient(${step.current ? T.blue : T.border},${T.border})`, marginTop: 4, marginBottom: 4 }} />}
            </div>
            <GlassPane style={{
              flex: 1,
              padding: 18,
              marginBottom: i < ROADMAP.length - 1 ? 0 : 0,
              border: `1px solid ${step.current ? "rgba(59,110,248,0.35)" : T.border}`,
              background: step.current ? "rgba(59,110,248,0.07)" : "rgba(13,18,38,0.75)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16 }}>{step.title}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: T.textDim }}>{step.time}</span>
                  {step.current && <Pill label="Current" color={T.green} />}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {step.skills.map((s) => <Pill key={s} label={s} color={step.current ? T.blue : T.textDim} />)}
              </div>
            </GlassPane>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifsPage() {
  const [notifs, setNotifs] = useState(NOTIFS);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Notifications</h2>
        <Btn variant="ghost" size="sm" style={{ border: `1px solid ${T.border}` }} onClick={() => setNotifs((n) => n.map((x) => ({ ...x, unread: false })))}>Mark all read</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifs.map((n, i) => (
          <GlassPane
            key={i}
            hover
            style={{
              padding: 18,
              display: "flex",
              gap: 14,
              alignItems: "center",
              opacity: n.unread ? 1 : 0.55,
              border: `1px solid ${n.unread ? T.borderMid : T.border}`,
              cursor: "pointer",
              animation: `fadeUp 0.3s ${i * 0.07}s ease both`,
            }}
            onClick={() => setNotifs((prev) => prev.map((x, j) => (j === i ? { ...x, unread: false } : x)))}
          >
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: n.color + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: T.textDim }}>{n.time}</div>
            </div>
            {n.unread && <div style={{ width: 9, height: 9, borderRadius: "50%", background: T.blue, boxShadow: `0 0 10px ${T.blue}`, flexShrink: 0 }} />}
          </GlassPane>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const matchTrend = [76, 80, 83, 87, 91, 94];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {[
          ["📋", "Applications", 58, T.blue],
          ["✅", "Shortlisted", 12, T.green],
          ["📞", "Interviews", 6, T.violet],
          ["🎉", "Offers", 2, T.amber],
        ].map(([icon, l, v, c], i) => (
          <GlassPane key={l} style={{ padding: 20, textAlign: "center", border: `1px solid ${c}18`, animation: `fadeUp 0.35s ${i * 0.07}s ease both` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, color: c }}><Counter end={v} /></div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 4 }}>{l}</div>
          </GlassPane>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: 18 }}>
        <GlassPane style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, fontFamily: "'Space Grotesk',sans-serif" }}>Applications per week</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
            {[3, 7, 5, 12, 8, 14, 9].map((v, i) => {
              const pct = (v / 14) * 100;
              const hot = i === 5;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: hot ? T.text : T.textDim, fontWeight: hot ? 700 : 400 }}>{v}</span>
                  <div style={{
                    width: "100%",
                    background: hot ? T.grad1 : "rgba(255,255,255,0.05)",
                    borderRadius: "4px 4px 0 0",
                    height: `${pct}%`,
                    transition: "height 1.2s cubic-bezier(.4,0,.2,1)",
                    boxShadow: hot ? "0 0 14px rgba(59,110,248,0.4)" : "none",
                  }} />
                  <span style={{ fontSize: 11, color: T.textDim }}>["MTWTFSS"][i]</span>
                </div>
              );
            })}
          </div>
        </GlassPane>
        <GlassPane style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, fontFamily: "'Space Grotesk',sans-serif" }}>Match score trend</div>
          {months.map((m, i) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: T.textDim, width: 26 }}>{m}</span>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 5 }}>
                <div style={{ width: `${matchTrend[i]}%`, height: "100%", background: T.grad1, borderRadius: 100, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, width: 34, color: "#93C5FD", textAlign: "right" }}>{matchTrend[i]}%</span>
            </div>
          ))}
        </GlassPane>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [prefs, setPrefs] = useState({ jobMatch: true, tests: true, views: false, email: true });
  const tog = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Settings</h2>
      <GlassPane style={{ padding: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, fontFamily: "'Space Grotesk',sans-serif" }}>Notification Preferences</div>
        {[["jobMatch","🎯","Job Match Alerts","Notify when AI finds a match above 80%"],["tests","🧪","Test Invitations","Receive test invites from companies"],["views","👁️","Profile Views","When recruiters view your profile"],["email","✉️","Weekly Email Digest","Summary of your job search activity"]].map(([k, icon, title, desc]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
            <div
              onClick={() => tog(k)}
              style={{
                width: 46,
                height: 24,
                borderRadius: 12,
                cursor: "pointer",
                position: "relative",
                background: prefs[k] ? T.grad1 : "rgba(255,255,255,0.08)",
                transition: "background 0.25s",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute",
                top: 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                left: prefs[k] ? 25 : 3,
                transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </div>
          </div>
        ))}
      </GlassPane>
      <GlassPane style={{ padding: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, fontFamily: "'Space Grotesk',sans-serif" }}>Account</div>
        <div style={{ display: "flex", gap: 12 }}>
          <Btn variant="ghost" style={{ border: `1px solid ${T.border}` }}>Change Password</Btn>
          <Btn variant="ghost" style={{ border: `1px solid ${T.border}` }}>Export Data</Btn>
        </div>
      </GlassPane>
      <GlassPane style={{ padding: 22, border: "1px solid rgba(244,63,94,0.2)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: T.rose }}>Danger Zone</div>
        <div style={{ display: "flex", gap: 12 }}>
          <Btn variant="danger" size="sm">Deactivate Account</Btn>
          <Btn variant="danger" size="sm">Delete All Data</Btn>
        </div>
      </GlassPane>
    </div>
  );
}

function MessagesPage() {
  const convos = [
    { name: "Google Recruiter", last: "Looking forward to your application...", time: "2h", avatar: "G", color: "#4285F4", unread: 2 },
    { name: "Microsoft HR", last: "Congratulations on being shortlisted!", time: "1d", avatar: "M", color: "#00A4EF", unread: 0 },
    { name: "Stripe Talent", last: "Can you share your availability for...", time: "2d", avatar: "S", color: "#635BFF", unread: 1 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>Messages</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {convos.map((c, i) => (
          <GlassPane key={c.name} hover style={{
            padding: 18,
            display: "flex",
            gap: 14,
            alignItems: "center",
            cursor: "pointer",
            animation: `fadeUp 0.3s ${i * 0.08}s ease both`,
          }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 50,
              background: c.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 18,
              flexShrink: 0,
              boxShadow: `0 0 12px ${c.color}44`,
            }}>{c.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: T.textDim }}>{c.time}</span>
              </div>
              <div style={{ fontSize: 13, color: T.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
            </div>
            {c.unread > 0 && (
              <div style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: T.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}>{c.unread}</div>
            )}
          </GlassPane>
        ))}
      </div>
      <GlassPane style={{ padding: 32, textAlign: "center", border: `1px dashed ${T.border}` }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
        <div style={{ color: T.textMid, fontSize: 14 }}>Select a conversation to start messaging</div>
      </GlassPane>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  return page === "landing" ? <Landing onEnter={() => setPage("auth")} /> : page === "auth" ? <Auth onAuth={() => setPage("app")} /> : <AppShell onLogout={() => setPage("landing")} />;
}
