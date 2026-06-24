import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  greenDeep:  "#0D2818",
  greenMid:   "#1A5C38",
  greenLight: "#2E7D52",
  redIkat:    "#C0392B",
  redDark:    "#922B21",
  gold:       "#D4A543",
  goldLight:  "#E8C06A",
  cream:      "#FAF7F2",
  cream2:     "#F0EAE0",
  ink:        "#1A1A1A",
  ink2:       "#3D3D3D",
  ink3:       "#6B6B6B",
  white:      "#FFFFFF",
};

// ─── SVG PATTERNS ────────────────────────────────────────────────────────────
const HERO_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23D4A543' stroke-width='0.8' opacity='0.18'%3E%3Cpolygon points='40,4 56,20 40,36 24,20' /%3E%3Cpolygon points='40,44 56,60 40,76 24,60' /%3E%3Cpolygon points='4,40 20,24 36,40 20,56' /%3E%3Cpolygon points='44,40 60,24 76,40 60,56' /%3E%3C/g%3E%3Ccircle cx='40' cy='40' r='2' fill='%23C0392B' opacity='0.4'/%3E%3Ccircle cx='0' cy='0' r='2' fill='%23C0392B' opacity='0.4'/%3E%3Ccircle cx='80' cy='0' r='2' fill='%23C0392B' opacity='0.4'/%3E%3Ccircle cx='0' cy='80' r='2' fill='%23C0392B' opacity='0.4'/%3E%3Ccircle cx='80' cy='80' r='2' fill='%23C0392B' opacity='0.4'/%3E%3C/svg%3E")`;

const STATS_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23D4A543' stroke-width='0.6' opacity='0.08'%3E%3Cpolygon points='40,4 56,20 40,36 24,20' /%3E%3Cpolygon points='40,44 56,60 40,76 24,60' /%3E%3Cpolygon points='4,40 20,24 36,40 20,56' /%3E%3Cpolygon points='44,40 60,24 76,40 60,56' /%3E%3C/g%3E%3C/svg%3E")`;

const SUBTLE_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%230D2818' stroke-width='0.6' opacity='0.05'%3E%3Cpolygon points='30,4 42,16 30,28 18,16' /%3E%3Cpolygon points='30,32 42,44 30,56 18,44' /%3E%3Cpolygon points='4,30 16,18 28,30 16,42' /%3E%3Cpolygon points='32,30 44,18 56,30 44,42' /%3E%3C/g%3E%3C/svg%3E")`;

const ABOUT_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23D4A543' stroke-width='0.6' opacity='0.2'%3E%3Cpolygon points='30,4 42,16 30,28 18,16' /%3E%3Cpolygon points='30,32 42,44 30,56 18,44' /%3E%3Cpolygon points='4,30 16,18 28,30 16,42' /%3E%3Cpolygon points='32,30 44,18 56,30 44,42' /%3E%3C/g%3E%3C/svg%3E")`;

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: #FAF7F2; color: #1A1A1A; overflow-x: hidden; }

  .sb-fade-up { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
  .sb-fade-up.visible { opacity: 1; transform: translateY(0); }
  .sb-fade-up:nth-child(1){transition-delay:.05s} .sb-fade-up:nth-child(2){transition-delay:.15s}
  .sb-fade-up:nth-child(3){transition-delay:.25s} .sb-fade-up:nth-child(4){transition-delay:.35s}
  .sb-fade-up:nth-child(5){transition-delay:.45s} .sb-fade-up:nth-child(6){transition-delay:.55s}
  .sb-fade-up:nth-child(7){transition-delay:.65s} .sb-fade-up:nth-child(8){transition-delay:.75s}

  @keyframes scrollPulse {
    0%,100%{opacity:.3;transform:scaleY(.8)} 50%{opacity:1;transform:scaleY(1)}
  }
  .sb-scroll-line { animation: scrollPulse 2s ease-in-out infinite; }

  .sb-service-card { transition: transform .3s ease, box-shadow .3s ease; }
  .sb-service-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,.09)!important; }
  .sb-service-card::before {
    content:''; position:absolute; top:0;left:0;right:0; height:3px;
    background:#D4A543; transform:scaleX(0); transform-origin:left; transition:transform .3s ease;
  }
  .sb-service-card:hover::before { transform:scaleX(1); }

  .sb-koleksi-card { transition: background .3s, border-color .3s; }
  .sb-koleksi-card:hover { background: #0D2818!important; border-color: #0D2818!important; }
  .sb-koleksi-card:hover .k-num { color: #D4A543!important; }
  .sb-koleksi-card:hover .k-name { color: rgba(255,255,255,.9)!important; }
  .sb-koleksi-card:hover .k-desc { color: rgba(255,255,255,.5)!important; }

  .sb-jam-row { transition: background .2s; }
  .sb-jam-row:hover { background: #F5F5F0; }

  .sb-btn-primary {
    background:#D4A543; color:#0D2818; padding:14px 32px; border-radius:2px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
    letter-spacing:.06em; text-transform:uppercase; text-decoration:none;
    border:2px solid #D4A543; cursor:pointer; transition:all .25s; display:inline-block;
  }
  .sb-btn-primary:hover { background:#E8C06A; border-color:#E8C06A; transform:translateY(-1px); box-shadow:0 8px 24px rgba(212,165,67,.35); }

  .sb-btn-outline {
    background:transparent; color:#fff; padding:14px 32px; border-radius:2px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:500;
    letter-spacing:.06em; text-transform:uppercase; text-decoration:none;
    border:2px solid rgba(255,255,255,.3); cursor:pointer; transition:all .25s; display:inline-block;
  }
  .sb-btn-outline:hover { border-color:rgba(255,255,255,.7); background:rgba(255,255,255,.07); }

  .sb-btn-dark {
    background:#0D2818; color:#fff; padding:14px 32px; border-radius:2px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
    letter-spacing:.06em; text-transform:uppercase; text-decoration:none;
    border:2px solid #0D2818; cursor:pointer; transition:all .25s; display:inline-block;
  }
  .sb-btn-dark:hover { background:#1A5C38; border-color:#1A5C38; }

  .sb-nav-link { font-family:'Inter',sans-serif; font-size:13px; font-weight:500; color:rgba(255,255,255,.82); text-decoration:none; letter-spacing:.04em; transition:color .25s; text-transform:uppercase; }
  .sb-nav-link:hover { color:#E8C06A; }
  .sb-nav-cta { background:#D4A543; color:#0D2818!important; padding:8px 22px; border-radius:2px; font-weight:600!important; }
  .sb-nav-cta:hover { background:#E8C06A!important; }

  .sb-footer-link { font-size:13px; color:rgba(255,255,255,.5); text-decoration:none; transition:color .2s; }
  .sb-footer-link:hover { color:#E8C06A; }

  .sb-service-link { display:inline-flex; align-items:center; gap:6px; margin-top:20px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#1A5C38; text-decoration:none; transition:gap .2s; }
  .sb-service-link:hover { gap:10px; }

  @media (prefers-reduced-motion:reduce) {
    .sb-fade-up { opacity:1; transform:none; transition:none; }
    .sb-scroll-line { animation:none; }
  }
  @media (max-width:768px) {
    .sb-hero-grid { grid-template-columns:1fr!important; }
    .sb-hero-visual { display:none!important; }
    .sb-about-grid { grid-template-columns:1fr!important; }
    .sb-stats-grid { grid-template-columns:1fr 1fr!important; }
    .sb-services-grid { grid-template-columns:1fr!important; }
    .sb-koleksi-grid { grid-template-columns:1fr 1fr!important; }
    .sb-jam-grid { grid-template-columns:1fr!important; }
    .sb-lokasi-grid { grid-template-columns:1fr!important; }
    .sb-footer-grid { grid-template-columns:1fr!important; }
    .sb-nav-links { display:none!important; }
    .sb-hamburger { display:flex!important; }
    .sb-hero-content { padding:100px 24px 64px!important; }
    .sb-container { padding:0 24px!important; }
  }
  @media (max-width:1024px) {
    .sb-container { padding:0 40px!important; }
    .sb-footer-grid { grid-template-columns:1fr 1fr!important; }
    .sb-koleksi-grid { grid-template-columns:repeat(2,1fr)!important; }
  }
`;

// ─── SMALL REUSABLE COMPONENTS ────────────────────────────────────────────────

function Eyebrow({ label, center }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:18, ...(center && {justifyContent:"center"}) }}>
      <div style={{ width:32, height:2, background:T.gold }} />
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.18em", color:T.gold, textTransform:"uppercase" }}>{label}</span>
      {center && <div style={{ width:32, height:2, background:T.gold }} />}
    </div>
  );
}

function SectionH2({ children, light }) {
  return (
    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:700, lineHeight:1.15, color: light ? T.white : T.greenDeep, marginBottom:20 }}>
      {children}
    </h2>
  );
}

function IkatDivider({ dark }) {
  const svg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24' viewBox='0 0 40 24'%3E%3Cpath d='M0 12 L10 4 L20 12 L30 4 L40 12 L30 20 L20 12 L10 20 Z' fill='none' stroke='%23D4A543' stroke-width='1.5' opacity='0.6'/%3E%3C/svg%3E")`;
  return (
    <div style={{ width:"100%", height:24, backgroundImage:svg, backgroundRepeat:"repeat-x", backgroundSize:"40px 24px", filter: dark ? "brightness(0.4)" : "none" }} />
  );
}

function BookIcon({ stroke = T.greenDeep, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

// ─── IKAT MOTIF SVG ───────────────────────────────────────────────────────────
function IkatMotifBand() {
  return (
    <svg width="100%" height="40" viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="rgba(250,247,242,0.25)" strokeWidth="1.2">
        <polyline points="0,20 30,5 60,20 90,5 120,20 150,5 180,20 210,5 240,20 270,5 300,20 330,5 360,20 390,5 420,20 450,5 480,20 510,5 540,20 570,5 600,20 630,5 660,20 690,5 720,20 750,5 780,20 810,5 840,20 870,5 900,20 930,5 960,20 990,5 1020,20 1050,5 1080,20 1110,5 1140,20 1170,5 1200,20 1230,5 1260,20 1290,5 1320,20 1350,5 1380,20 1410,5 1440,20"/>
        <polyline points="0,20 30,35 60,20 90,35 120,20 150,35 180,20 210,35 240,20 270,35 300,20 330,35 360,20 390,35 420,20 450,35 480,20 510,35 540,20 570,35 600,20 630,35 660,20 690,35 720,20 750,35 780,20 810,35 840,20 870,35 900,20 930,35 960,20 990,35 1020,20 1050,35 1080,20 1110,35 1140,20 1170,35 1200,20 1230,35 1260,20 1290,35 1320,20 1350,35 1380,20 1410,35 1440,20"/>
      </g>
      <g fill="rgba(212,165,67,0.5)">
        {[30,90,150,210,270,330,390,450,510,570,630,690,750,810,870,930,990,1050,1110,1170,1230,1290,1350,1410].map(cx => (
          <circle key={cx} cx={cx} cy={5} r={2}/>
        ))}
      </g>
    </svg>
  );
}

// ─── FADE-UP HOOK ─────────────────────────────────────────────────────────────
function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const els = el.querySelectorAll(".sb-fade-up");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(e => obs.observe(e));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const dur = 1800;
        const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          setVal(Math.floor(ease(p) * target));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(target);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: .5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString("id-ID")}{suffix}</span>;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ scrolled, menuOpen, setMenuOpen }) {
  const links = [
    { href: "#tentang", label: "Tentang" },
    { href: "#layanan", label: "Layanan" },
    { href: "#koleksi", label: "Koleksi" },
    { href: "#jam", label: "Jam Buka" },
  ];
  return (
    <>
      <nav style={{
        position:"fixed", top:0, width:"100%", zIndex:100,
        padding:"0 40px",
        background: scrolled ? "rgba(13,40,24,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.3)" : "none",
        transition:"all .4s ease",
      }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
          {/* Logo */}
          <a href="#" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
            <div style={{ width:38, height:38, background:T.gold, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <BookIcon stroke={T.greenDeep} size={22} />
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:T.white, letterSpacing:"0.02em" }}>Perpustakaan Daerah</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:T.goldLight, letterSpacing:"0.1em", textTransform:"uppercase" }}>Kabupaten Sumba Barat</div>
            </div>
          </a>
          {/* Desktop links */}
          <ul className="sb-nav-links" style={{ display:"flex", gap:36, listStyle:"none" }}>
            {links.map(l => (
              <li key={l.href}><a href={l.href} className="sb-nav-link">{l.label}</a></li>
            ))}
            <li><a href="#lokasi" className="sb-nav-link sb-nav-cta">Kunjungi</a></li>
          </ul>
          {/* Hamburger */}
          <button className="sb-hamburger" onClick={() => setMenuOpen(o => !o)}
            style={{ display:"none", flexDirection:"column", gap:5, cursor:"pointer", background:"none", border:"none", padding:4 }}
            aria-label="Menu">
            {[0,1,2].map(i => <span key={i} style={{ display:"block", width:24, height:2, background:"white", borderRadius:2 }} />)}
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:"fixed", top:72, left:0, right:0, zIndex:99,
          background:"rgba(13,40,24,0.98)", backdropFilter:"blur(12px)",
          padding:"24px 32px 32px", display:"flex", flexDirection:"column", gap:4,
          borderTop:"1px solid rgba(255,255,255,.08)",
        }}>
          {[...links, { href:"#lokasi", label:"Lokasi & Kontak" }].map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ padding:"14px 0", fontSize:15, color:"rgba(255,255,255,.8)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,.06)", fontWeight:500 }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" style={{ minHeight:"100vh", position:"relative", display:"flex", alignItems:"center", overflow:"hidden" }}>
      {/* BG layers */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#0A1F12 0%,#1A3D24 60%,#0D2818 100%)" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:HERO_PATTERN, backgroundSize:"80px 80px" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 70% 50%,transparent 40%,rgba(0,0,0,.5) 100%)" }} />

      {/* Content */}
      <div className="sb-hero-grid sb-hero-content" style={{
        position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto",
        padding:"120px 80px 80px", display:"grid",
        gridTemplateColumns:"1fr 1fr", alignItems:"center", gap:80, width:"100%"
      }}>
        {/* Left */}
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:28 }}>
            <div style={{ width:40, height:2, background:T.gold }} />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.18em", color:T.gold, textTransform:"uppercase" }}>
              Waikabubak · Sumba Barat · NTT
            </span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.6rem,5vw,4.2rem)", fontWeight:900, lineHeight:1.08, color:T.white, marginBottom:28, letterSpacing:"-0.01em" }}>
            Jendela{" "}
            <em style={{ fontStyle:"italic", color:T.goldLight }}>Ilmu</em>
            <br />untuk Sumba
            <br />yang Berdaya
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.7)", lineHeight:1.8, maxWidth:480, marginBottom:44, fontWeight:300 }}>
            Perpustakaan Daerah Kabupaten Sumba Barat hadir sebagai ruang belajar terbuka bagi seluruh masyarakat — dari anak-anak hingga profesional, dari pelajar hingga peneliti.
          </p>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            <a href="#koleksi" className="sb-btn-primary">Jelajahi Koleksi</a>
            <a href="#lokasi" className="sb-btn-outline">Cara Berkunjung</a>
          </div>
        </div>

        {/* Right — Ikat card */}
        <div className="sb-hero-visual" style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ position:"relative", width:340 }}>
            <div style={{ position:"absolute", top:-12, right:-12, width:80, height:80, background:T.redIkat, borderRadius:2, zIndex:0, opacity:.7 }} />
            <div style={{ position:"absolute", bottom:-10, left:-10, width:50, height:50, border:`2px solid ${T.gold}`, borderRadius:2, zIndex:0, opacity:.4 }} />
            <div style={{ background:"rgba(255,255,255,.06)", border:`1px solid rgba(212,165,67,.3)`, borderRadius:4, padding:40, backdropFilter:"blur(8px)", position:"relative", zIndex:1 }}>
              <div style={{ marginBottom:28 }}>
                <svg width="100%" viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="0,8 13,2 26,8 39,2 52,8 65,2 78,8 91,2 104,8 117,2 130,8 143,2 156,8 169,2 182,8 195,2 208,8 221,2 234,8 247,2 260,8" fill="none" stroke="#D4A543" strokeWidth="1.5" opacity=".7"/>
                  <polyline points="0,72 13,78 26,72 39,78 52,72 65,78 78,72 91,78 104,72 117,78 130,72 143,78 156,72 169,78 182,72 195,78 208,72 221,78 234,72 247,78 260,72" fill="none" stroke="#D4A543" strokeWidth="1.5" opacity=".7"/>
                  <g fill="none" stroke="#C0392B" strokeWidth="1.2" opacity=".8">
                    {[20,60,100,140,180,220].map(x => <polygon key={x} points={`${x},40 ${x+12},28 ${x+24},40 ${x+12},52`}/>)}
                  </g>
                  <g fill="#D4A543" opacity=".6">
                    {[20,60,100,140,180,220].map(x => <polygon key={x} points={`${x},40 ${x+4},36 ${x+8},40 ${x+4},44`}/>)}
                  </g>
                  <g stroke="#D4A543" strokeWidth=".8" opacity=".35">
                    {[44,84,124,164,204].map(x => <line key={x} x1={x} y1="40" x2={x+16} y2="40"/>)}
                  </g>
                  <g fill="rgba(250,247,242,.5)">
                    {[32,72,112,152,192,232].map(x => [<circle key={`t${x}`} cx={x} cy={28} r={2}/>, <circle key={`b${x}`} cx={x} cy={52} r={2}/>])}
                  </g>
                </svg>
              </div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,.9)", lineHeight:1.6, borderLeft:`3px solid ${T.gold}`, paddingLeft:20, marginBottom:20 }}>
                "Membaca adalah jembatan antara hari ini dan masa depan Sumba."
              </p>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.12em", color:T.gold, textTransform:"uppercase" }}>
                — Perpustakaan Daerah Kab. Sumba Barat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#tentang" style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, zIndex:2, textDecoration:"none" }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(255,255,255,.4)", textTransform:"uppercase" }}>Gulir</span>
        <div className="sb-scroll-line" style={{ width:1, height:40, background:"linear-gradient(to bottom,rgba(255,255,255,.4),transparent)" }} />
      </a>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const ref = useFadeUp();
  return (
    <section id="tentang" style={{ background:T.cream, padding:"100px 0" }} ref={ref}>
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px" }}>
        <div className="sb-about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div className="sb-fade-up">
            <Eyebrow label="Tentang Kami" />
            <SectionH2>Pusat Literasi<br /><em style={{ color:T.redIkat }}>Masyarakat Sumba</em></SectionH2>
            <p style={{ fontSize:17, color:T.ink2, lineHeight:1.85, fontWeight:300, marginBottom:20 }}>
              Perpustakaan Daerah Kabupaten Sumba Barat adalah institusi pengetahuan milik pemerintah daerah yang berdedikasi untuk meningkatkan budaya literasi di wilayah Sumba Barat.
            </p>
            <p style={{ fontSize:15, color:T.ink3, lineHeight:1.9, marginBottom:20 }}>
              Berlokasi di Waikabubak, ibu kota Kabupaten Sumba Barat, perpustakaan kami menyediakan koleksi buku, jurnal, dan sumber belajar digital yang dapat diakses oleh seluruh lapisan masyarakat — mulai dari pelajar, mahasiswa, aparatur sipil negara, hingga masyarakat umum.
            </p>
            <p style={{ fontSize:15, color:T.ink3, lineHeight:1.9 }}>
              Sebagai pusat literasi daerah, kami berkomitmen menjadi mitra terpercaya dalam perjalanan belajar setiap warga Sumba Barat menuju masyarakat yang cerdas dan berdaya.
            </p>
          </div>

          <div className="sb-fade-up" style={{ position:"relative" }}>
            <div style={{ position:"absolute", top:-16, left:-16, width:60, height:60, background:T.redIkat, borderRadius:2, zIndex:0 }} />
            <div style={{ background:T.greenDeep, borderRadius:4, padding:48, position:"relative", overflow:"hidden", zIndex:1 }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:ABOUT_PATTERN, backgroundSize:"60px 60px" }} />
              <div style={{ position:"relative" }}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.15em", color:T.gold, textTransform:"uppercase", marginBottom:8 }}>Tahun Berdiri</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:60, fontWeight:900, color:T.white, lineHeight:1 }}>2003</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,.55)", marginTop:8 }}>Melayani masyarakat lebih dari 20 tahun</div>
                <div style={{ width:40, height:1, background:T.gold, margin:"28px 0" }} />
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.15em", color:T.gold, textTransform:"uppercase", marginBottom:8 }}>Status</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.white }}>Institusi Pemerintah Daerah</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,.55)", marginTop:8 }}>Unit kerja Kabupaten Sumba Barat</div>
              </div>
            </div>
            <div style={{ background:T.gold, borderRadius:4, padding:"24px 28px", position:"absolute", bottom:-20, right:-24, boxShadow:"0 12px 40px rgba(0,0,0,.15)", zIndex:2 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:T.greenDeep, lineHeight:1 }}>5.000+</div>
              <div style={{ fontSize:12, color:T.greenDeep, fontWeight:500, marginTop:6, lineHeight:1.4 }}>Judul buku &<br/>koleksi tersedia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { target:5000, suffix:"+", label:"Koleksi Buku\n& Referensi", icon:<BookIcon stroke={T.gold} size={22}/> },
    { target:1200, suffix:"+", label:"Anggota\nTerdaftar", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { target:20, suffix:"+", label:"Tahun\nMelayani", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )},
    { target:6, suffix:"", label:"Hari Layanan\nper Minggu", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    )},
  ];
  return (
    <section id="statistik" style={{ background:T.greenDeep, padding:"72px 0", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:STATS_PATTERN, backgroundSize:"80px 80px" }} />
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px", position:"relative" }}>
        <div className="sb-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding:"24px 40px", textAlign:"center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.08)" : "none" }}>
              <div style={{ width:36, height:36, margin:"0 auto 16px", opacity:.55 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:900, color:T.gold, lineHeight:1, marginBottom:8 }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.55)", letterSpacing:"0.04em", lineHeight:1.5, whiteSpace:"pre-line" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LAYANAN ──────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <BookIcon stroke="#1A5C38" size={26}/>,
    title:"Peminjaman Buku",
    desc:"Pinjam koleksi buku fiksi, non-fiksi, referensi, dan buku pelajaran dengan masa pinjam fleksibel hingga 14 hari. Prosedur mudah dengan kartu anggota.",
    link:"Daftar Anggota",
  },
  {
    icon:(
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title:"Layanan Digital & Internet",
    desc:"Akses internet gratis untuk penelusuran informasi, e-book, dan sumber belajar daring. Tersedia komputer umum yang dapat digunakan pengunjung.",
    link:"Pelajari Lebih",
  },
  {
    icon:(
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title:"Ruang Baca Umum",
    desc:"Ruang baca nyaman dan kondusif dengan kapasitas memadai, dilengkapi pencahayaan optimal dan sirkulasi udara yang baik untuk mendukung konsentrasi belajar.",
    link:"Lihat Fasilitas",
  },
  {
    icon:(
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title:"Koleksi Lokal & Budaya",
    desc:"Koleksi khusus tentang budaya Sumba, sejarah daerah, adat istiadat Marapu, dan karya-karya penulis lokal yang menjadi kebanggaan masyarakat.",
    link:"Lihat Koleksi",
  },
  {
    icon:(
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title:"Program Literasi Anak",
    desc:"Program membaca bersama, mendongeng, dan kegiatan edukatif khusus anak-anak untuk menumbuhkan kecintaan membaca sejak dini di kalangan generasi muda.",
    link:"Lihat Program",
  },
  {
    icon:(
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title:"Layanan Referensi",
    desc:"Bantuan profesional dari pustakawan kami dalam menemukan sumber informasi yang tepat untuk keperluan penelitian, tugas akademik, atau kebutuhan profesi.",
    link:"Tanya Pustakawan",
  },
];

function LayananSection() {
  const ref = useFadeUp();
  return (
    <>
      <IkatDivider dark />
      <section id="layanan" style={{ background:T.cream2, padding:"100px 0" }} ref={ref}>
        <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px" }}>
          <Eyebrow label="Layanan Kami" />
          <SectionH2>Apa yang Kami<br /><em style={{ color:T.redIkat }}>Sediakan untuk Anda</em></SectionH2>
          <div className="sb-services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginTop:52 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="sb-service-card sb-fade-up" style={{ background:T.white, borderRadius:4, padding:"40px 36px", border:"1px solid rgba(0,0,0,.06)", position:"relative", overflow:"hidden" }}>
                <div style={{ width:52, height:52, background:T.cream2, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:T.greenDeep, marginBottom:12 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:T.ink3, lineHeight:1.8 }}>{s.desc}</p>
                <a href="#" className="sb-service-link">{s.link} <span>→</span></a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── KOLEKSI ──────────────────────────────────────────────────────────────────
const COLLECTIONS = [
  { emoji:"📚", num:"1.200+", name:"Buku Pelajaran", desc:"SD, SMP, SMA & perguruan tinggi" },
  { emoji:"🏺", num:"350+",  name:"Koleksi Lokal",  desc:"Budaya & sejarah Sumba" },
  { emoji:"📖", num:"800+",  name:"Fiksi & Sastra",  desc:"Novel, cerpen, puisi Indonesia" },
  { emoji:"🔬", num:"600+",  name:"Ilmu Pengetahuan",desc:"Sains, teknologi, dan medis" },
  { emoji:"⚖️", num:"280+",  name:"Hukum & Pemerintahan", desc:"Regulasi, undang-undang, kebijakan" },
  { emoji:"🌱", num:"420+",  name:"Pertanian & Lingkungan", desc:"Agrikultur lokal & ekologi NTT" },
  { emoji:"🧒", num:"550+",  name:"Buku Anak",       desc:"Cerita bergambar & edukasi dini" },
  { emoji:"📰", num:"100+",  name:"Jurnal & Majalah",desc:"Terbitan berkala & referensi ilmiah" },
];

function KoleksiSection() {
  const ref = useFadeUp();
  return (
    <section id="koleksi" style={{ background:T.cream, padding:"100px 0" }} ref={ref}>
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px" }}>
        <div style={{ maxWidth:640, marginBottom:56 }}>
          <Eyebrow label="Koleksi Perpustakaan" />
          <SectionH2>Ragam Koleksi untuk<br /><em style={{ color:T.redIkat }}>Setiap Kebutuhan</em></SectionH2>
          <p style={{ fontSize:17, color:T.ink2, lineHeight:1.85, fontWeight:300 }}>
            Dari sastra klasik hingga ilmu pengetahuan modern, koleksi kami dirancang untuk memenuhi kebutuhan belajar seluruh lapisan masyarakat Sumba Barat.
          </p>
        </div>
        <div className="sb-koleksi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
          {COLLECTIONS.map((c, i) => (
            <div key={i} className="sb-koleksi-card sb-fade-up" style={{ background:T.white, borderRadius:4, padding:"32px 24px", textAlign:"center", border:"1px solid rgba(0,0,0,.05)" }}>
              <div style={{ fontSize:30, marginBottom:16 }}>{c.emoji}</div>
              <div className="k-num" style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:T.greenDeep, transition:"color .3s" }}>{c.num}</div>
              <div className="k-name" style={{ fontSize:13, fontWeight:600, color:T.ink2, marginTop:6, transition:"color .3s" }}>{c.name}</div>
              <div className="k-desc" style={{ fontSize:11, color:T.ink3, marginTop:4, lineHeight:1.5, transition:"color .3s" }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── JAM LAYANAN ──────────────────────────────────────────────────────────────
const JAM_DATA = [
  { day:"Senin",  time:"07.30 – 15.30", status:"open" },
  { day:"Selasa", time:"07.30 – 15.30", status:"open" },
  { day:"Rabu",   time:"07.30 – 15.30", status:"open" },
  { day:"Kamis",  time:"07.30 – 15.30", status:"open" },
  { day:"Jumat",  time:"07.30 – 11.00", status:"ishoma" },
  { day:"Sabtu",  time:"08.00 – 13.00", status:"open" },
  { day:"Minggu", time:null,             status:"closed" },
];

function JamSection() {
  const ref = useFadeUp();
  const infoCards = [
    {
      color:"green", bg:"#E8F5EE", stroke:"#1A5C38",
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
      title:"Pendaftaran Anggota Gratis",
      text:"Daftar menjadi anggota perpustakaan tanpa biaya. Cukup bawa KTP atau kartu pelajar saat mendaftar di loket layanan kami.",
    },
    {
      color:"gold", bg:"#FFF8EC",
      icon:<BookIcon stroke={T.gold} size={22}/>,
      title:"Masa Pinjam 14 Hari",
      text:"Pinjam maksimal 3 judul buku sekaligus dengan masa pinjam 14 hari. Perpanjangan dapat dilakukan satu kali sebelum masa pinjam habis.",
    },
    {
      color:"red", bg:"#FEF0EE",
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.redIkat} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.5 4.86 2 2 0 0 1 3.49 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
      title:"Hubungi Sebelum Berkunjung",
      text:"Untuk keperluan khusus seperti penelitian, kunjungan kelompok, atau peminjaman koleksi langka, hubungi kami terlebih dahulu.",
    },
  ];
  return (
    <section id="jam" style={{ background:T.cream2, padding:"100px 0" }} ref={ref}>
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px" }}>
        <Eyebrow label="Jam Operasional" />
        <SectionH2>Kapan Anda<br /><em style={{ color:T.redIkat }}>Dapat Berkunjung</em></SectionH2>
        <div className="sb-jam-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, marginTop:52 }}>
          {/* Table */}
          <div style={{ background:T.white, borderRadius:4, overflow:"hidden", border:"1px solid rgba(0,0,0,.06)" }}>
            <div style={{ background:T.greenDeep, padding:"20px 28px", display:"flex", alignItems:"center", gap:12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.12em", color:T.gold, textTransform:"uppercase" }}>Jadwal Layanan Mingguan</span>
            </div>
            {JAM_DATA.map((row, i) => (
              <div key={i} className="sb-jam-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 28px", borderBottom: i < JAM_DATA.length-1 ? "1px solid rgba(0,0,0,.05)" : "none" }}>
                <span style={{ fontSize:14, color:T.ink2, fontWeight:500 }}>{row.day}</span>
                {row.status === "closed"
                  ? <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:T.redIkat }}>Libur</span>
                  : <span style={{ fontFamily:"'Space Mono',monospace", fontSize:13, color:T.greenMid, fontWeight:700 }}>{row.time}</span>
                }
                {row.status === "open" && <span style={{ background:"#D1F2E1", color:"#0A7A3A", padding:"2px 8px", borderRadius:2, fontSize:10, fontWeight:600 }}>Buka</span>}
                {row.status === "ishoma" && <span style={{ background:"#FFF3CD", color:"#856404", padding:"2px 8px", borderRadius:2, fontSize:10, fontWeight:600 }}>Ishoma</span>}
                {row.status === "closed" && <span />}
              </div>
            ))}
          </div>
          {/* Info cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {infoCards.map((card, i) => (
              <div key={i} className="sb-fade-up" style={{ background:T.white, borderRadius:4, padding:28, border:"1px solid rgba(0,0,0,.05)", display:"flex", gap:20, alignItems:"flex-start" }}>
                <div style={{ width:44, height:44, borderRadius:4, background:card.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{card.icon}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, color:T.ink, marginBottom:4 }}>{card.title}</div>
                  <div style={{ fontSize:13, color:T.ink3, lineHeight:1.6 }}>{card.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="cta" style={{ background:T.cream, padding:"80px 0", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:SUBTLE_PATTERN, backgroundSize:"60px 60px" }} />
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px", position:"relative" }}>
        <Eyebrow label="Mari Bergabung" center />
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:700, color:T.greenDeep, marginBottom:16 }}>
          Mulai Perjalanan<br /><em style={{ color:T.redIkat }}>Membaca Anda</em> Hari Ini
        </h2>
        <p style={{ fontSize:17, color:T.ink3, marginBottom:40, maxWidth:520, margin:"0 auto 40px", lineHeight:1.7 }}>
          Bergabunglah bersama ribuan warga Sumba Barat yang telah merasakan manfaat perpustakaan daerah kami. Daftar gratis, kunjungi, dan mulai belajar.
        </p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="#lokasi" className="sb-btn-dark">Temukan Kami</a>
          <a href="#layanan" className="sb-btn-primary">Lihat Layanan</a>
        </div>
      </div>
    </section>
  );
}

// ─── LOKASI ───────────────────────────────────────────────────────────────────
function LokasiSection() {
  const ref = useFadeUp();
  const contacts = [
    {
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      label:"Alamat",
      text:"Kp. Sawah, Kec. Kota Waikabubak\nKabupaten Sumba Barat\nNusa Tenggara Timur — 87211",
    },
    {
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.5 4.86 2 2 0 0 1 3.49 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
      label:"Telepon",
      text:"(0387) 21XXX\nSenin–Jumat, 07.30–15.30",
    },
    {
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      label:"Email",
      text:"perpustakaan@sumbabarat.go.id",
    },
    {
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      label:"Kode Plus",
      text:"9C7F+67M Waikabubak",
    },
  ];
  return (
    <section id="lokasi" style={{ background:T.greenDeep, padding:"100px 0" }} ref={ref}>
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px" }}>
        <Eyebrow label="Lokasi & Kontak" />
        <SectionH2 light>Temukan<br /><em style={{ color:T.goldLight }}>Kami di Waikabubak</em></SectionH2>
        <div className="sb-lokasi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:60, marginTop:52 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
            {contacts.map((c, i) => (
              <div key={i} className="sb-fade-up" style={{ display:"flex", gap:18, alignItems:"flex-start" }}>
                <div style={{ width:44, height:44, background:"rgba(255,255,255,.07)", border:`1px solid rgba(212,165,67,.25)`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.15em", color:T.gold, textTransform:"uppercase", marginBottom:4 }}>{c.label}</div>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,.8)", lineHeight:1.6, whiteSpace:"pre-line" }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderRadius:4, overflow:"hidden", border:`1px solid rgba(212,165,67,.2)` }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.2!2d119.4!3d-9.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c4b1e2955c50a65%3A0x4087e5e531d72b7e!2sPerpustakaan%20Daerah%20Kabupaten%20Sumba%20Barat!5e0!3m2!1sid!2sid!4v1234567890"
              style={{ display:"block", width:"100%", height:380, border:"none", filter:"grayscale(20%) contrast(1.05)" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Perpustakaan Daerah Kabupaten Sumba Barat"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title:"Navigasi", links:[["#tentang","Tentang Kami"],["#layanan","Layanan"],["#koleksi","Koleksi"],["#jam","Jam Operasional"],["#lokasi","Lokasi"]] },
    { title:"Layanan",  links:[["#","Peminjaman Buku"],["#","Ruang Baca"],["#","Akses Internet"],["#","Program Anak"],["#","Referensi"]] },
    { title:"Informasi",links:[["#","Cara Daftar Anggota"],["#","Aturan Peminjaman"],["#","Katalog Online"],["#","Kegiatan & Acara"],["#","Hubungi Kami"]] },
  ];
  return (
    <footer style={{ background:"#070F09", padding:"64px 0 0", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:STATS_PATTERN, backgroundSize:"80px 80px" }} />
      <div className="sb-container" style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px", position:"relative" }}>
        <div className="sb-footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:60, paddingBottom:52 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:T.white, marginBottom:4 }}>Perpustakaan Daerah</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.15em", color:T.gold, textTransform:"uppercase" }}>Kabupaten Sumba Barat</div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.4)", lineHeight:1.8, marginTop:20, maxWidth:280 }}>
              Melayani masyarakat Sumba Barat dengan koleksi buku, layanan literasi, dan program pendidikan yang inklusif dan berkelanjutan.
            </p>
            {/* Mini ikat motif */}
            <div style={{ marginTop:28, opacity:.35 }}>
              <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#D4A543" strokeWidth="1">
                  {[15,35,55,75,95,115].map(x => <polygon key={x} points={`${x},2 ${x+7},9 ${x},16 ${x-7},9`}/>)}
                </g>
                <g fill="#C0392B" opacity=".7">
                  {[15,35,55,75,95,115].map(x => <polygon key={x} points={`${x},9 ${x+2},7 ${x+4},9 ${x+2},11`}/>)}
                </g>
                <line x1="0" y1="20" x2="120" y2="20" stroke="#D4A543" strokeWidth=".6" opacity=".3"/>
              </svg>
            </div>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.16em", color:T.gold, textTransform:"uppercase", marginBottom:20 }}>{col.title}</div>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                {col.links.map(([href, label], j) => (
                  <li key={j}><a href={href} className="sb-footer-link">{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)", padding:"24px 0", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.25)" }}>
            © 2024 Perpustakaan Daerah Kabupaten Sumba Barat · Pemerintah Kabupaten Sumba Barat
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {[1,.6,1].map((op, i) => <div key={i} style={{ width:8, height:8, background:T.gold, transform:"rotate(45deg)", opacity:op * .4 }} />)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Inject global CSS + Google Fonts
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <>
      <Navbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <HeroSection />
      <IkatDivider />
      <AboutSection />
      <StatsSection />
      <LayananSection />
      <KoleksiSection />
      {/* Red ikat band */}
      <div style={{ background:T.redIkat, padding:"20px 0", overflow:"hidden" }}>
        <IkatMotifBand />
      </div>
      <JamSection />
      <CTASection />
      <LokasiSection />
      <Footer />
    </>
  );
}