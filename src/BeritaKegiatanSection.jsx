import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.jsx";

const T = {
  greenDeep:  "#0D2818", greenMid:   "#1A5C38",
  gold:       "#D4A543", redIkat:    "#C0392B",
  cream:      "#FAF7F2", cream2:     "#F0EAE0",
  ink2:       "#3D3D3D", ink3:       "#6B6B6B", white:"#FFF",
};

function Eyebrow({ label }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <div style={{ width:32, height:2, background:T.gold }} />
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.18em", color:T.gold, textTransform:"uppercase" }}>{label}</span>
    </div>
  );
}

function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll(".sb-fade-up");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    children.forEach(e => obs.observe(e));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function PostModal({ post, onClose }) {
  if (!post) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.white, borderRadius:8, maxWidth:640, width:"100%", maxHeight:"90vh", overflow:"auto", padding:40, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:20, background:"none", border:"none", fontSize:24, cursor:"pointer", color:T.ink3, lineHeight:1 }}>×</button>
        {post.image_url && <img src={post.image_url} alt={post.title} style={{ width:"100%", height:280, objectFit:"cover", borderRadius:4, marginBottom:24 }} />}
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
          <span style={{ padding:"2px 10px", borderRadius:2, fontSize:10, fontWeight:700, textTransform:"uppercase", background: post.type === "berita" ? "#DBEAFE" : "#FEF3C7", color: post.type === "berita" ? "#1E40AF" : "#92400E" }}>{post.type}</span>
          <span style={{ fontSize:12, color:T.ink3, fontFamily:"'Space Mono',monospace" }}>{post.date}</span>
        </div>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.greenDeep, marginBottom:16 }}>{post.title}</h3>
        {post.content.split("\n").map((p, i) => <p key={i} style={{ fontSize:15, color:T.ink2, lineHeight:1.8, marginBottom:12 }}>{p}</p>)}
      </div>
    </div>
  );
}

export default function BeritaKegiatanSection() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [selected, setSelected] = useState(null);
  const ref = useFadeUp();

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("date", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { loadPosts(); }, []);

  const filtered = filter === "semua" ? posts : posts.filter(p => p.type === filter);

  return (
    <section id="berita" style={{ background:T.cream, padding:"100px 0" }} ref={ref}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 80px" }}>
        <Eyebrow label="Berita & Kegiatan" />
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:700, color:T.greenDeep, marginBottom:8 }}>Informasi Terbaru<br /><em style={{ color:T.redIkat }}>dari Perpustakaan</em></h2>
        <p style={{ fontSize:17, color:T.ink2, lineHeight:1.85, fontWeight:300, maxWidth:640, marginBottom:40 }}>
          Berita dan kegiatan terkini dari Dinas Perpustakaan dan Kearsipan Kabupaten Sumba Barat.
        </p>

        <div style={{ display:"flex", gap:4, marginBottom:40, borderBottom:"1px solid rgba(0,0,0,.06)", paddingBottom:0 }}>
          {[
            { key:"semua", label:"Semua" },
            { key:"berita", label:"Berita" },
            { key:"kegiatan", label:"Kegiatan" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              style={{
                padding:"12px 24px", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, letterSpacing:"0.05em",
                background:"transparent", textTransform:"uppercase", color: filter === tab.key ? T.greenDeep : T.ink3, opacity: filter === tab.key ? 1 : .5,
                borderBottom: filter === tab.key ? `2px solid ${T.gold}` : "2px solid transparent",
                marginBottom:-1, transition:"all .2s",
              }}>{tab.label}</button>
          ))}
        </div>

        <div className="sb-berita-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {filtered.map((post, i) => (
            <div key={post.id || i} className="sb-fade-up"
              onClick={() => setSelected(post)}
              style={{ background:T.white, borderRadius:4, overflow:"hidden", border:"1px solid rgba(0,0,0,.06)", cursor:"pointer",
                transition:"transform .3s, box-shadow .3s", display:"flex", flexDirection:"column" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              {post.image_url
                ? <img src={post.image_url} alt={post.title} style={{ width:"100%", height:180, objectFit:"cover" }} />
                : <div style={{ height:180, background:T.cream2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, color:T.ink3 }}>📄</div>}
              <div style={{ padding:24, flex:1, display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                  <span style={{ padding:"2px 8px", borderRadius:2, fontSize:9, fontWeight:700, textTransform:"uppercase", background: post.type === "berita" ? "#DBEAFE" : "#FEF3C7", color: post.type === "berita" ? "#1E40AF" : "#92400E" }}>{post.type}</span>
                  <span style={{ fontSize:11, color:T.ink3 }}>{post.date}</span>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:T.greenDeep, lineHeight:1.3, marginBottom:10 }}>{post.title}</h3>
                <p style={{ fontSize:13, color:T.ink3, lineHeight:1.7, flex:1 }}>{(post.content || "").substring(0, 120)}{(post.content || "").length > 120 ? "…" : ""}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:60, color:T.ink3, fontSize:15 }}>Belum ada {filter === "semua" ? "berita atau kegiatan" : filter} untuk ditampilkan.</div>
        )}

        <PostModal post={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
