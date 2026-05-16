import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area,
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  dOlive: "#1e2d07",
  olive: "#3a5212",
  mOlive: "#4e6e18",
  bOlive: "#6b8c22",
  sage: "#8eb530",
  lSage: "#b8d06b",
  pGreen: "#dff0a8",
  cream: "#f3f8e4",
  white: "#ffffff",
};

const S = {
  fontSerif: "'Playfair Display', Georgia, serif",
  fontSans: "'Inter', system-ui, sans-serif",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const marketGrowthData = [
  { year: "2024", fso: 181, fao: 44, bpo: 66 },
  { year: "2025", fso: 188, fao: 46, bpo: 73 },
  { year: "2026", fso: 194, fao: 48, bpo: 81 },
  { year: "2027", fso: 207, fao: 50, bpo: 90 },
  { year: "2028", fso: 221, fao: 52, bpo: 98 },
  { year: "2029", fso: 237, fao: 55, bpo: 107 },
  { year: "2030", fso: 253, fao: 57, bpo: 117 },
  { year: "2031", fso: 271, fao: 60, bpo: 127 },
  { year: "2032", fso: 291, fao: 63, bpo: 135 },
  { year: "2035", fso: 342, fao: 70, bpo: 160 },
];

const segmentData = [
  { name: "BPO", value: 52, color: C.olive },
  { name: "ITO", value: 33, color: C.bOlive },
  { name: "KPO", value: 15, color: C.sage },
];

const serviceProcessData = [
  { name: "O2C", share: 38, color: C.olive },
  { name: "P2P", share: 27, color: C.mOlive },
  { name: "R2R", share: 20, color: C.bOlive },
  { name: "Treasury", share: 10, color: C.sage },
  { name: "Tax", share: 5, color: C.lSage },
];

const servicesData = {
  BPO: {
    title: "Business Process Outsourcing",
    subtitle: "Transactional finance excellence at India-scale speed and accuracy.",
    items: [
      { icon: "📊", name: "Accounts Payable / Receivable", detail: "End-to-end invoice processing, vendor payments, cash application — O2C and P2P mastery at global scale." },
      { icon: "💼", name: "Payroll Management", detail: "Multi-jurisdiction payroll, statutory compliance, PF/ESI/TDS, and employee benefits administration." },
      { icon: "🔁", name: "Bank Reconciliation", detail: "Daily/weekly reconciliation, exception management, and complete audit trails for every account." },
      { icon: "🧾", name: "Order-to-Cash (O2C)", detail: "Global finance transactions — from customer invoicing through collections and cash application." },
      { icon: "📖", name: "Bookkeeping & Data Entry", detail: "QuickBooks, Xero, NetSuite, SAP, Tally — accurate, scalable, and always audit-ready." },
      { icon: "🏦", name: "General Ledger & Close", detail: "Record-to-Report cycle management, period-end close, GL maintenance, and IFRS/GAAP-compliant financial statements." },
    ],
  },
  KPO: {
    title: "Knowledge Process Outsourcing",
    subtitle: "High-value analytical and strategic advisory from India's chartered finance professionals.",
    items: [
      { icon: "📈", name: "Financial Research & Analytics", detail: "Risk modeling, investment analysis, portfolio valuation, comparable analysis, and M&A financial support." },
      { icon: "🏛️", name: "Tax Strategy & Compliance", detail: "US GAAP, IFRS, BEPS 2.0, multi-jurisdiction transfer pricing documentation, and VAT/GST advisory." },
      { icon: "🎯", name: "FP&A & Forecasting", detail: "Budget planning, rolling forecasts, scenario modeling, variance analysis, and board-ready management decks." },
      { icon: "👔", name: "Virtual CFO Services", detail: "Forward-looking strategic finance advisory for mid-market firms — without the executive overheads." },
      { icon: "🌿", name: "ESG & Non-Financial Reporting", detail: "EU CSRD, BRSR (India), GRI, SASB — automated non-financial data collection and regulatory disclosure." },
      { icon: "⚖️", name: "Risk & Compliance Advisory", detail: "SOX, SOC 2, internal controls design, regulatory mapping, and enterprise risk framework implementation." },
    ],
  },
};

const advantagesData = [
  { icon: "💰", num: "25–45%", sub: "Cost Savings vs US/EU", desc: "End-to-end accounting at a fraction of onshore cost with zero quality trade-off." },
  { icon: "👥", num: "1.2M+", sub: "F&A Professionals", desc: "CPAs, CAs, ACCAs — the deepest qualified finance talent pool on the planet." },
  { icon: "🌐", num: "#1", sub: "English-Speaking Hub", desc: "Largest English-speaking workforce outside the US/UK. Zero language friction." },
  { icon: "🕐", num: "24/7", sub: "Follow-the-Sun Delivery", desc: "Round-the-clock operations covering US, UK, EU, and APAC time zones seamlessly." },
  { icon: "📋", num: "Multi", sub: "GAAP / Regulatory Mastery", desc: "US GAAP, IFRS, UK GAAP, BEPS 2.0, ESG — we speak every compliance language." },
  { icon: "🏗️", num: "600+", sub: "F&A Delivery Centers", desc: "Dedicated Finance & Accounting BPO infrastructure distributed across all of India." },
];

const globalRegions = [
  { icon: "🌏", region: "Asia-Pacific", badge: "10.63% CAGR", note: "Fastest growing region globally. $34.6B FAO market projected by 2033 — India is the gateway." },
  { icon: "🌎", region: "North America", badge: "Upcoming", note: "Cost optimisation and AI adoption driving demand; 300,000+ open accounting roles generating offshore pull." },
];



const whyReasons = [
  { num: "01", title: "Domain-First Talent", desc: "Every engagement staffed with qualified CAs, CPAs, and ACCAs — not generalist BPO agents." },
  { num: "02", title: "Tech-Led Delivery", desc: "RPA, AI agents, and continuous-close tools are baked into every engagement from day one — not bolted on." },
  { num: "03", title: "Multi-Jurisdiction Mastery", desc: "US GAAP, IFRS, UK GAAP, BEPS 2.0, GDPR, SOX — we speak your compliance language fluently." },
  { num: "04", title: "Outcome-Based Pricing", desc: "Beyond legacy FTE billing to transaction-based and value-partnership models that align our success with yours." },
  { num: "05", title: "Tier-1 Security", desc: "ISO 27001, SOC 2 Type II, zero-trust architecture. Your data confidentiality is never a question mark." },
  { num: "06", title: "Scalable at Speed", desc: "2-person bookkeeping or 200-person FP&A team — scale up or down with zero friction and zero notice periods." },
];

const statsItems = [
  { id: "s1", target: 194, suffix: "K+", label: "FAO Professionals in India" },
  { id: "s2", target: 600, suffix: "+", label: "F&A BPO Delivery Centers" },
  { id: "s3", target: 45, suffix: "%", label: "Max Cost Savings vs Onshore" },
  { id: "s4", target: 75, suffix: "%", label: "Fortune 500 Use Finance BPO" },
];

const navLinks = ["About", "Services", "Markets", "India Edge", "Contact"];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#fff", border: `1px solid ${C.lSage}`, borderRadius: 10, padding: "12px 16px", fontFamily: S.fontSans, boxShadow: "0 4px 16px rgba(0,0,0,.1)" }}>
        <p style={{ fontWeight: 800, color: C.olive, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 13, margin: "2px 0" }}>
            {p.name}: <strong>${p.value}B</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return count;
}

function useIntersection(ref, threshold = 0.3) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// Animated counter stat card
function StatCard({ target, suffix, label }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const count = useCountUp(target, 2000, visible);
  return (
    <div ref={ref} style={{
      textAlign: "center", padding: "28px 16px", background: C.white,
      borderRadius: 16, border: `1px solid ${C.lSage}`,
      transition: "box-shadow .2s", fontFamily: S.fontSans,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(58,82,18,.13)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ fontSize: 44, fontWeight: 900, color: C.olive, lineHeight: 1, fontFamily: S.fontSerif }}>
        {count}<span style={{ fontSize: 22, color: C.sage }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 12, color: C.mOlive, marginTop: 8, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

// Section tag
function Tag({ children, dark }) {
  return (
    <span style={{
      display: "inline-block",
      background: dark ? "rgba(255,255,255,.18)" : C.pGreen,
      color: dark ? C.pGreen : C.olive,
      fontSize: 11, fontWeight: 800, letterSpacing: "1.8px",
      padding: "4px 14px", borderRadius: 20, marginBottom: 16,
      fontFamily: S.fontSans, textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

// Section heading
function SectionHead({ tag, h2, p, dark, center }) {
  return (
    <div style={{ textAlign: center ? "center" : "left" }}>
      <Tag dark={dark}>{tag}</Tag>
      <h2 style={{
        fontFamily: S.fontSerif,
        fontSize: "clamp(26px,3vw,42px)",
        fontWeight: 800, color: dark ? "#fff" : C.dOlive,
        lineHeight: 1.2, marginBottom: 14, letterSpacing: "-.5px",
      }}>{h2}</h2>
      <p style={{
        fontSize: 17, color: dark ? C.lSage : "#4a5c1a",
        lineHeight: 1.85, maxWidth: 660, fontFamily: S.fontSans,
        margin: center ? "0 auto" : 0,
      }}>{p}</p>
    </div>
  );
}

// Progress bar
function ProgressBar({ label, pct, desc }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: S.fontSans }}>{label}</span>
        <span style={{ fontSize: 13, color: C.lSage, fontFamily: S.fontSans }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,.18)", borderRadius: 3 }}>
        <div style={{ height: "100%", borderRadius: 3, background: C.sage, width: `${pct}%`, transition: "width 1s ease" }} />
      </div>
      {desc && <div style={{ fontSize: 11, color: C.lSage, marginTop: 5, fontFamily: S.fontSans }}>{desc}</div>}
    </div>
  );
}

// Check item
function CheckItem({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: 22, height: 22, background: C.pGreen, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, flexShrink: 0, color: C.olive, fontWeight: 800,
      }}>✓</div>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.olive, fontFamily: S.fontSans }}>{text}</span>
    </div>
  );
}

// Service card
function SvcCard({ icon, name, detail }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, border: `1.5px solid ${hov ? C.sage : C.lSage}`,
        borderRadius: 16, padding: 28, cursor: "default",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 12px 32px rgba(58,82,18,.12)" : "none",
        transition: "all .25s",
      }}
    >
      <div style={{
        width: 48, height: 48, background: C.pGreen, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 14,
      }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: C.dOlive, marginBottom: 8, fontFamily: S.fontSans }}>{name}</div>
      <p style={{ fontSize: 13, color: "#5a6e30", lineHeight: 1.65, margin: 0, fontFamily: S.fontSans }}>{detail}</p>
    </div>
  );
}

// Advantage card
function AdvCard({ icon, num, sub, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, border: `1.5px solid ${hov ? C.sage : C.lSage}`,
        borderRadius: 18, padding: 30, position: "relative", overflow: "hidden",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 12px 32px rgba(58,82,18,.12)" : "none",
        transition: "all .25s",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: C.pGreen, borderRadius: "0 18px 0 80px", opacity: .7,
      }} />
      <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 900, color: C.olive, lineHeight: 1, fontFamily: S.fontSerif }}>{num}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.dOlive, marginTop: 4, marginBottom: 10, fontFamily: S.fontSans }}>{sub}</div>
      <p style={{ fontSize: 13, color: "#5a6e30", margin: 0, lineHeight: 1.65, fontFamily: S.fontSans }}>{desc}</p>
    </div>
  );
}

// Global region card
function GlobalCard({ icon, region, badge, note }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, border: `1.5px solid ${hov ? C.sage : C.lSage}`,
        borderRadius: 14, padding: 24, display: "flex", gap: 16, alignItems: "flex-start",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(58,82,18,.1)" : "none",
        transition: "all .2s",
      }}
    >
      <div style={{
        width: 48, height: 48, background: C.pGreen, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.dOlive, marginBottom: 4, fontFamily: S.fontSans }}>{region}</div>
        <span style={{
          display: "inline-block", background: C.pGreen, color: C.olive,
          fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 10,
          marginBottom: 8, fontFamily: S.fontSans, letterSpacing: ".4px",
        }}>{badge}</span>
        <p style={{ fontSize: 12, color: "#5a6e30", margin: 0, lineHeight: 1.6, fontFamily: S.fontSans }}>{note}</p>
      </div>
    </div>
  );
}

// Tech card
function TechCard({ icon, title, stat, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.07)",
        border: `1px solid ${hov ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.13)"}`,
        borderRadius: 14, padding: 26,
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all .25s",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6, fontFamily: S.fontSans }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.sage, marginBottom: 8, fontFamily: S.fontSerif }}>{stat}</div>
      <p style={{ fontSize: 12, color: C.lSage, lineHeight: 1.65, margin: 0, fontFamily: S.fontSans }}>{desc}</p>
    </div>
  );
}

// Why card
function WhyCard({ num, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: 30, border: `1.5px solid ${hov ? C.sage : C.lSage}`,
        borderRadius: 18, position: "relative", transition: "all .25s",
        boxShadow: hov ? "0 12px 32px rgba(58,82,18,.1)" : "none",
        background: C.white,
      }}
    >
      <span style={{
        fontSize: 52, fontWeight: 900, color: C.pGreen,
        position: "absolute", top: 14, right: 18, lineHeight: 1,
        fontFamily: S.fontSerif, pointerEvents: "none",
      }}>{num}</span>
      <h4 style={{ fontSize: 17, fontWeight: 800, color: C.dOlive, marginBottom: 10, fontFamily: S.fontSans }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#5a6e30", lineHeight: 1.75, margin: 0, fontFamily: S.fontSans }}>{desc}</p>
    </div>
  );
}

// Mini metric card
function MiniCard({ val, label, cagr }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.lSage}`,
      borderRadius: 12, padding: "16px 18px",
    }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.olive, fontFamily: S.fontSerif }}>{val}</div>
      <div style={{ fontSize: 12, color: C.dOlive, fontWeight: 800, marginTop: 2, fontFamily: S.fontSans }}>{label}</div>
      {cagr && <div style={{ fontSize: 11, color: C.mOlive, marginTop: 2, fontFamily: S.fontSans }}>{cagr}</div>}
    </div>
  );
}

// Compliance badge
function Badge({ text }) {
  return (
    <span style={{
      background: "rgba(255,255,255,.15)", color: "#fff",
      fontSize: 11, padding: "4px 12px", borderRadius: 12,
      fontFamily: S.fontSans, fontWeight: 700,
    }}>{text}</span>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const idMap = {
    "About": "about", "Services": "services", "Markets": "markets",
    "India Edge": "india", "Contact": "contact",
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 2rem", transition: "all .3s",
      background: scrolled ? C.dOlive : "transparent",
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.3)" : "none",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between", height: 72,
      }}>
        {/* Logo */}
        <div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-.5px", fontFamily: S.fontSerif }}>
            SSRMM<span style={{ color: C.sage }}>.</span>
          </span>
          <em style={{
            fontSize: 10, color: C.lSage, display: "block",
            fontStyle: "normal", fontWeight: 600, letterSpacing: ".8px", fontFamily: S.fontSans,
          }}>Consultants (OPC) Pvt. Ltd.</em>
        </div>
        {/* Desktop links */}
        <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}
          className="nav-links-desktop">
          {navLinks.map(l => (
            <li key={l}>
              <button onClick={() => scrollTo(idMap[l])} style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.pGreen, fontSize: 13, fontWeight: 700,
                letterSpacing: ".3px", fontFamily: S.fontSans,
                padding: 0, transition: "color .2s",
              }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = C.pGreen}
              >{l}</button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => scrollTo("contact")}
          style={{
            background: C.sage, color: C.dOlive, border: "none",
            padding: "9px 22px", borderRadius: 8, fontWeight: 800,
            fontSize: 13, cursor: "pointer", fontFamily: S.fontSans, letterSpacing: ".3px",
          }}>Get Started ↗</button>
      </div>
    </nav>
  );
}

function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="home" style={{
      background: `linear-gradient(135deg, ${C.dOlive} 0%, ${C.olive} 55%, ${C.mOlive} 100%)`,
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 2rem 80px", position: "relative", overflow: "hidden",
    }}>
      {/* decorative circles */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 600, height: 600, borderRadius: "50%", background: "rgba(157,191,69,.06)" }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 64,
        alignItems: "center", position: "relative", zIndex: 1,
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)",
            borderRadius: 20, padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: C.sage,
              animation: "pulse 2s infinite", display: "inline-block",
            }} />
            <span style={{ color: C.pGreen, fontSize: 12, fontWeight: 700, letterSpacing: ".8px", fontFamily: S.fontSans }}>
              INDIA'S PREMIER FINANCE OUTSOURCING PARTNER
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(34px,4.5vw,64px)", fontWeight: 900, color: "#fff",
            lineHeight: 1.08, marginBottom: 20, letterSpacing: "-1px",
            fontFamily: S.fontSerif,
          }}>
            Global Finance.<br />
            <span style={{ color: C.sage }}>India Excellence.</span><br />
            Zero Compromise.
          </h1>
          <p style={{
            fontSize: 17, color: C.pGreen, maxWidth: 580, lineHeight: 1.8,
            marginBottom: 40, fontFamily: S.fontSans,
          }}>
            SSRMM Consultants (OPC) Pvt. Ltd. delivers world-class Finance & Accounting Outsourcing,
            KPO advisory, and technology-enabled finance transformation — from Bengaluru to the world.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("services")} style={{
              background: "#fff", color: C.dOlive, padding: "14px 30px",
              borderRadius: 8, fontWeight: 800, fontSize: 14, border: "none",
              cursor: "pointer", fontFamily: S.fontSans, letterSpacing: ".3px", transition: "all .2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)"; }}
              onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
            >Explore Services</button>
            <button onClick={() => scrollTo("contact")} style={{
              background: "transparent", color: "#fff", padding: "14px 30px",
              borderRadius: 8, fontWeight: 700, fontSize: 14, border: "2px solid rgba(255,255,255,.4)",
              cursor: "pointer", fontFamily: S.fontSans, transition: "all .2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#fff"; e.target.style.background = "rgba(255,255,255,.08)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,.4)"; e.target.style.background = "transparent"; }}
            >Schedule a Consult →</button>
          </div>
        </div>
        {/* Right hero cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { icon: "📈", num: "$194B", label: "Global FSO Market 2026" },
            { icon: "🏢", num: "90%", label: "US CFOs use outsourcing" },
            { icon: "💸", num: "45%", label: "Max cost savings vs onshore" },
            { icon: "🌱", num: "6.8%", label: "Market CAGR to 2035" },
          ].map((c, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)",
              borderRadius: 14, padding: "20px 18px", backdropFilter: "blur(8px)",
              transition: "transform .2s", cursor: "default",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: S.fontSerif }}>{c.num}</div>
              <div style={{ fontSize: 11, color: C.lSage, marginTop: 6, lineHeight: 1.4, fontFamily: S.fontSans }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section style={{ background: C.cream, padding: "52px 2rem", borderBottom: `3px solid ${C.lSage}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
        {statsItems.map(s => <StatCard key={s.id} {...s} />)}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ background: C.white, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        {/* Left */}
        <div>
          <SectionHead
            tag="About SSRMM"
            h2="Your Trusted Finance Outsourcing Partner"
            p="SSRMM Consultants (OPC) Private Limited is a Bengaluru-based finance outsourcing firm specialising in precision-grade BPO, KPO, and technology outsourcing services to clients across the US, UK, EU, and APAC regions."
          />
          <p style={{ fontSize: 16, color: "#4a5c1a", lineHeight: 1.85, fontFamily: S.fontSans, marginTop: 16, marginBottom: 28 }}>
            Backed by India's deep talent pool of CAs, CPAs, and ACCAs — and powered by the latest RPA and
            AI-driven workflows — we deliver 25–45% cost efficiency gains with zero compromise on quality, compliance, or data security.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {["ISO 27001 Compliant", "SOC 2 Type II Ready", "Multi-GAAP Expertise", "24/7 Operations", "BEPS 2.0 Advisory", "ESG Reporting"].map(t => (
              <CheckItem key={t} text={t} />
            ))}
          </div>
        </div>
        {/* Right */}
        <div style={{
          background: `linear-gradient(135deg, ${C.olive}, ${C.mOlive})`,
          borderRadius: 20, padding: 40, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40, width: 180, height: 180,
            background: "rgba(255,255,255,.06)", borderRadius: "50%",
          }} />
          <div style={{ fontSize: 13, fontWeight: 800, color: C.lSage, marginBottom: 28, letterSpacing: "1.2px", fontFamily: S.fontSans }}>
            OUR SERVICE MIX
          </div>
          <ProgressBar label="BPO Services" pct={52} desc="52% of market — transactional excellence at scale" />
          <ProgressBar label="IT & Technology" pct={33} desc="33% — AI and automation-led delivery" />
          <ProgressBar label="KPO Services" pct={15} desc="15% — fastest growing in value and margin" />
          <div style={{
            marginTop: 28, padding: 18, background: "rgba(255,255,255,.12)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 12, color: C.lSage, fontFamily: S.fontSans, marginBottom: 8 }}>HEADQUARTERS</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: S.fontSans }}>Bengaluru, Karnataka 🇮🇳</div>
            <div style={{ fontSize: 12, color: C.lSage, fontFamily: S.fontSans, marginTop: 4 }}>India's Silicon Valley — serving the world</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [activeTab, setActiveTab] = useState("BPO");
  const tabs = ["BPO", "KPO"];
  const d = servicesData[activeTab];

  return (
    <section id="services" style={{ background: C.cream, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead
          tag="Services"
          h2="Three Pillars of Finance Excellence"
          p="From transactional processing to strategic advisory — we cover the full spectrum of finance outsourcing."
        />
        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, margin: "32px 0 28px", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "10px 28px", borderRadius: 8, fontWeight: 800, fontSize: 13,
              cursor: "pointer", transition: "all .2s", fontFamily: S.fontSans, letterSpacing: ".4px",
              background: activeTab === t ? C.olive : C.white,
              color: activeTab === t ? "#fff" : C.olive,
              border: `2px solid ${activeTab === t ? C.olive : C.lSage}`,
            }}>
              {t === "BPO" ? "BPO — Business Process" : "KPO — Knowledge Process"}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.dOlive, marginBottom: 6, fontFamily: S.fontSans }}>{d.title}</h3>
          <p style={{ fontSize: 14, color: C.mOlive, fontFamily: S.fontSans }}>{d.subtitle}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
          {d.items.map((item, i) => <SvcCard key={i} {...item} />)}
        </div>
      </div>
    </section>
  );
}

function Markets() {
  return (
    <section id="markets" style={{ background: C.white, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead
          tag="Market Intelligence"
          h2="A Market Built for the Next Decade"
          p="Global finance outsourcing is on an unstoppable trajectory. Here is what the data shows."
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48, alignItems: "start" }}>
          {/* Bar Chart */}
          <div style={{ background: C.white, borderRadius: 16, padding: 28, border: `1px solid ${C.lSage}` }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.olive, marginBottom: 4, fontFamily: S.fontSans }}>Global FSO Market Size (USD Billion)</div>
            <div style={{ fontSize: 12, color: C.mOlive, marginBottom: 20, fontFamily: S.fontSans }}>Financial Service Outsourcing — 2024 to 2035</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={marketGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.pGreen} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: C.mOlive, fontFamily: S.fontSans }} />
                <YAxis tick={{ fontSize: 11, fill: C.mOlive, fontFamily: S.fontSans }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="fso" name="FSO" fill={C.olive} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div>
            <div style={{ background: C.white, borderRadius: 16, padding: 28, border: `1px solid ${C.lSage}`, marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.olive, marginBottom: 4, fontFamily: S.fontSans }}>Key Segment Comparison</div>
              <div style={{ fontSize: 12, color: C.mOlive, marginBottom: 16, fontFamily: S.fontSans }}>FAO vs F&A BPO market growth trajectory</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={marketGrowthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.pGreen} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: C.mOlive, fontFamily: S.fontSans }} />
                  <YAxis tick={{ fontSize: 10, fill: C.mOlive, fontFamily: S.fontSans }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: S.fontSans }} />
                  <Line type="monotone" dataKey="fao" name="FAO" stroke={C.olive} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bpo" name="F&A BPO" stroke={C.sage} strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Mini metrics grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <MiniCard val="$342B" label="FSO by 2035" cagr="6.8% CAGR" />
              <MiniCard val="$134B" label="F&A BPO by 2032" cagr="9.22% CAGR" />
              <MiniCard val="10.63%" label="APAC CAGR" cagr="Fastest region" />
              <MiniCard val="$70.5B" label="FAO by 2035" cagr="4.3% CAGR" />
            </div>
          </div>
        </div>

        {/* Process share chart */}
        <div style={{ marginTop: 40, background: C.cream, borderRadius: 16, padding: 28, border: `1px solid ${C.lSage}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.olive, marginBottom: 4, fontFamily: S.fontSans }}>Finance Process Distribution</div>
          <div style={{ fontSize: 12, color: C.mOlive, marginBottom: 20, fontFamily: S.fontSans }}>Share of outsourced finance process volume by type</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={serviceProcessData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.lSage} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.mOlive, fontFamily: S.fontSans }} tickFormatter={v => `${v}%`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: C.dOlive, fontFamily: S.fontSans, fontWeight: 700 }} width={80} />
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} contentStyle={{ fontFamily: S.fontSans, borderRadius: 8, border: `1px solid ${C.lSage}` }} />
              <Bar dataKey="share" name="Share %" fill={C.olive} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function IndiaAdvantage() {
  return (
    <section id="india" style={{ background: C.cream, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead
          tag="India's Edge"
          h2="Why India — and Why SSRMM"
          p="India leads the world in finance outsourcing talent, infrastructure, and cost efficiency. SSRMM is your gateway into this advantage."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22, marginTop: 48 }}>
          {advantagesData.map((a, i) => <AdvCard key={i} {...a} />)}
        </div>
      </div>
    </section>
  );
}

function GlobalReach() {
  return (
    <section id="global" style={{ background: C.white, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead
          tag="Global Coverage"
          h2="Serving Clients Across All Key Regions"
          p="Our delivery model supports clients in North America, Europe, APAC, and beyond — with 24/7 operations from Bengaluru."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginTop: 48 }}>
          {globalRegions.map((r, i) => <GlobalCard key={i} {...r} />)}
        </div>
      </div>
    </section>
  );
}



function WhySSRMM() {
  return (
    <section id="why" style={{ background: C.cream, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead
          tag="Why SSRMM"
          h2="Six Reasons to Choose SSRMM"
          p="We are not a generalist BPO. We are a finance-first, technology-led, outcome-driven partner built for the next decade."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22, marginTop: 48 }}>
          {whyReasons.map((r, i) => <WhyCard key={i} {...r} />)}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", service: "", message: "" });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async () => {
    if (form.name && form.email) {
      try {
        await fetch("https://formsubmit.co/ajax/ssrmmopc@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: "New Consultation Request from SSRMM Website",
            Name: form.name,
            Email: form.email,
            Phone: form.phone,
            Company: form.company,
            Service: form.service,
            Message: form.message,
          })
        });
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        setSubmitted(true);
      }
    }
  };

  return (
    <section id="contact" style={{ background: C.olive, padding: "88px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        {/* Left */}
        <div>
          <Tag dark>Get in Touch</Tag>
          <h2 style={{ fontFamily: S.fontSerif, fontSize: "clamp(26px,3vw,40px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-.5px" }}>
            Let's Build Your Outsourcing Strategy
          </h2>
          <p style={{ fontSize: 16, color: C.pGreen, lineHeight: 1.85, marginBottom: 36, fontFamily: S.fontSans }}>
            Whether you're a US CPA firm, a UK fintech, or a Fortune 500 enterprise — SSRMM can design a
            finance outsourcing model that delivers measurable ROI from day one.
          </p>
          {[
            { icon: "📍", text: "Bengaluru, Karnataka, India" },
            { icon: "✉️", text: "contact@ssrmmconsultants.com" },
            { icon: "📞", text: "+91 9379918491 (Bengaluru)" },
            { icon: "🕐", text: "Available 24/7 — Follow-the-Sun Support" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, color: C.pGreen }}>
              <div style={{
                width: 44, height: 44, background: "rgba(255,255,255,.15)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18,
              }}>{c.icon}</div>
              <span style={{ fontSize: 14, fontFamily: S.fontSans }}>{c.text}</span>
            </div>
          ))}
          <div style={{ marginTop: 32, padding: 22, background: "rgba(255,255,255,.1)", borderRadius: 14, border: "1px solid rgba(255,255,255,.2)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.lSage, fontFamily: S.fontSans, letterSpacing: "1px", marginBottom: 10 }}>
              CERTIFICATIONS & COMPLIANCE
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["ISO 27001", "SOC 2 Type II", "GDPR Ready", "DPDP Act 2023", "SOX Compliant", "BEPS 2.0"].map(b => (
                <Badge key={b} text={b} />
              ))}
            </div>
          </div>
        </div>
        {/* Form */}
        <div style={{ background: C.white, borderRadius: 20, padding: 40 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.dOlive, marginBottom: 24, fontFamily: S.fontSans }}>
            Request a Consultation
          </h3>
          {submitted ? (
            <div style={{
              padding: 32, textAlign: "center", background: C.pGreen, borderRadius: 12,
              border: `2px solid ${C.sage}`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.olive, marginBottom: 8, fontFamily: S.fontSans }}>Request Submitted!</div>
              <p style={{ fontSize: 14, color: C.mOlive, fontFamily: S.fontSans }}>
                Thank you, {form.name}! Our team will reach out within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (form.name && form.email) {
                try {
                  // Simply go to web3forms.com, enter your email to get an access key, and paste it below:
                  const ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; 
                  
                  const res = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({
                      access_key: ACCESS_KEY,
                      subject: `New Consultation Request from ${form.name}`,
                      from_name: "SSRMM Website",
                      ...form
                    }),
                  });
                  
                  if (res.ok) {
                    setSubmitted(true);
                  } else {
                    alert("Please add your Web3Forms Access Key in the code first!");
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            }}>
              {[
                { name: "name", placeholder: "Your Full Name", type: "text", required: true },
                { name: "company", placeholder: "Company Name", type: "text" },
                { name: "email", placeholder: "Business Email", type: "email", required: true },
                { name: "phone", placeholder: "Phone Number", type: "tel" },
              ].map(f => (
                <input
                  key={f.name}
                  type={f.type}
                  name={f.name}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 8,
                    border: `1.5px solid ${C.lSage}`, fontSize: 14, marginBottom: 14,
                    color: C.dOlive, outline: "none", fontFamily: S.fontSans,
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = C.olive}
                  onBlur={e => e.target.style.borderColor = C.lSage}
                />
              ))}
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 8,
                  border: `1.5px solid ${C.lSage}`, fontSize: 14, marginBottom: 14,
                  color: form.service ? C.dOlive : "#999", outline: "none",
                  fontFamily: S.fontSans, background: C.white, cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Service of Interest</option>
                {["BPO — Transactional Finance", "KPO — Finance Analytics & Advisory", "ITO — Tech & Automation", "Virtual CFO Services", "Full Finance Transformation", "ESG Reporting"].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <textarea
                name="message"
                placeholder="Tell us about your finance outsourcing needs..."
                value={form.message}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 8,
                  border: `1.5px solid ${C.lSage}`, fontSize: 14, marginBottom: 14,
                  color: C.dOlive, outline: "none", fontFamily: S.fontSans,
                  resize: "vertical", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = C.olive}
                onBlur={e => e.target.style.borderColor = C.lSage}
              />
              <button
                type="submit"
                style={{
                  width: "100%", background: C.olive, color: "#fff",
                  padding: "14px 0", borderRadius: 8, fontWeight: 800,
                  fontSize: 15, border: "none", cursor: "pointer",
                  fontFamily: S.fontSans, letterSpacing: ".5px", transition: "all .2s",
                }}
                onMouseEnter={e => e.target.style.background = C.dOlive}
                onMouseLeave={e => e.target.style.background = C.olive}
              >
                Submit Consultation Request →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{ background: C.dOlive, padding: "52px 2rem 24px", borderTop: `3px solid ${C.mOlive}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 6, fontFamily: S.fontSerif }}>
              SSRMM<span style={{ color: C.sage }}>.</span>
            </div>
            <div style={{ fontSize: 11, color: C.lSage, marginBottom: 14, fontFamily: S.fontSans, letterSpacing: ".5px" }}>
              Consultants (OPC) Private Limited
            </div>
            <p style={{ fontSize: 13, color: "#7a9040", lineHeight: 1.7, maxWidth: 270, fontFamily: S.fontSans }}>
              India's trusted Finance & Accounting Outsourcing partner — delivering BPO, KPO, and ITO excellence to the world from Bengaluru.
            </p>
          </div>
          {[
            { title: "Services", links: ["BPO Services", "KPO Services", "IT Outsourcing", "Virtual CFO", "ESG Reporting"] },
            { title: "Markets", links: ["North America", "United Kingdom", "Europe / EU", "Asia-Pacific", "GCC Countries"] },
            { title: "Company", links: ["About Us", "Certifications", "Case Studies", "Careers", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.sage, letterSpacing: "1.5px", marginBottom: 16, fontFamily: S.fontSans, textTransform: "uppercase" }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: "#7a9040", marginBottom: 10, cursor: "pointer", fontFamily: S.fontSans, transition: "color .2s" }}
                  onMouseEnter={e => e.target.style.color = C.lSage}
                  onMouseLeave={e => e.target.style.color = "#7a9040"}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: `1px solid ${C.mOlive}`, paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ fontSize: 12, color: "#5a6e30", fontFamily: S.fontSans }}>
            © 2026 SSRMM Consultants (OPC) Private Limited. All rights reserved. | Bengaluru, India 🇮🇳
          </div>
          <div style={{ fontSize: 12, color: "#5a6e30", fontFamily: S.fontSans }}>
            MSME Registered | ISO 27001 | SOC 2 Type II
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // global keyframe for pulse
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { overflow-x: hidden; }
      @media(max-width:900px){
        .hero-grid { grid-template-columns:1fr !important; }
        .about-grid { grid-template-columns:1fr !important; }
        .market-grid { grid-template-columns:1fr !important; }
        .contact-grid { grid-template-columns:1fr !important; }
        .footer-grid { grid-template-columns:1fr 1fr !important; }
        .stats-grid { grid-template-columns:1fr 1fr !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ fontFamily: S.fontSans }}>
      <Navbar scrolled={scrolled} />
      <Hero />
      <StatsBar />
      <About />
      <Services />
      <Markets />
      <IndiaAdvantage />
      <GlobalReach />

      <WhySSRMM />
      <Contact />
      <Footer />
    </div>
  );
}
