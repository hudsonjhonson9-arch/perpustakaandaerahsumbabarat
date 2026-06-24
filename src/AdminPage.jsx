import { useState, useEffect } from "react";
import { supabase } from "./supabase.jsx";

const ADMIN_PASSWORD = "admin123";

const T = {
  greenDeep:"#0D2818", greenMid:"#1A5C38", gold:"#D4A543", redIkat:"#C0392B",
  cream:"#FAF7F2", cream2:"#F0EAE0", ink2:"#3D3D3D", ink3:"#6B6B6B", white:"#FFF",
};

function PasswordPrompt({ onAuth }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.cream }}>
      <div style={{ background:T.white, padding:40, borderRadius:8, boxShadow:"0 4px 24px rgba(0,0,0,.06)", width:360 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:T.greenDeep, marginBottom:8 }}>Admin</h2>
        <p style={{ fontSize:13, color:T.ink3, marginBottom:24 }}>Masukkan password untuk melanjutkan.</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && (pw === ADMIN_PASSWORD ? onAuth() : setErr("Password salah"))}
          placeholder="Password" autoFocus style={{ width:"100%", padding:"12px 16px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, fontSize:14, marginBottom:12 }} />
        {err && <p style={{ fontSize:12, color:T.redIkat, marginBottom:12 }}>{err}</p>}
        <button onClick={() => pw === ADMIN_PASSWORD ? onAuth() : setErr("Password salah")}
          style={{ width:"100%", padding:"12px", background:T.greenDeep, color:T.white, border:"none", borderRadius:4, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          Masuk
        </button>
      </div>
    </div>
  );
}

function PostForm({ post, onClose, onSaved }) {
  const [title, setTitle] = useState(post?.title || "");
  const [type, setType] = useState(post?.type || "berita");
  const [date, setDate] = useState(post?.date || new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState(post?.content || "");
  const [imageUrl, setImageUrl] = useState(post?.image_url || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return alert("Judul wajib diisi");
    setSaving(true);
    const payload = { title: title.trim(), type, date, content, image_url: imageUrl };
    if (post?.id) {
      await supabase.from("posts").update(payload).eq("id", post.id);
    } else {
      await supabase.from("posts").insert(payload);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.white, borderRadius:8, maxWidth:600, width:"100%", maxHeight:"90vh", overflow:"auto", padding:36 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:T.greenDeep, marginBottom:24 }}>
          {post ? "Edit" : "Tambah"} {type === "berita" ? "Berita" : "Kegiatan"}
        </h3>

        <div style={{ display:"grid", gap:16 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.ink3, marginBottom:4, display:"block" }}>Judul</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, fontSize:14 }} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.ink3, marginBottom:4, display:"block" }}>Tipe</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, fontSize:14 }}>
                <option value="berita">Berita</option>
                <option value="kegiatan">Kegiatan</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.ink3, marginBottom:4, display:"block" }}>Tanggal</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, fontSize:14 }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.ink3, marginBottom:4, display:"block" }}>URL Gambar</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://drive.google.com/uc?export=view&id=..." style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, fontSize:13 }} />
            <p style={{ fontSize:11, color:T.ink3, marginTop:4 }}>Upload gambar ke Google Drive via Apps Script (gas/upload.gs), lalu paste URL di sini.</p>
          </div>

          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.ink3, marginBottom:4, display:"block" }}>Konten</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={6}
              style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, fontSize:14, resize:"vertical", fontFamily:"inherit" }} />
          </div>
        </div>

        <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:28 }}>
          <button onClick={onClose} style={{ padding:"10px 24px", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, background:T.white, cursor:"pointer", fontSize:13 }}>Batal</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding:"10px 24px", background:T.greenDeep, color:T.white, border:"none", borderRadius:4, fontSize:13, fontWeight:600, cursor:"pointer", opacity: saving ? .6 : 1 }}>
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(localStorage.getItem("adminAuthed") === "1");
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { if (authed) loadPosts(); }, [authed]);

  if (!authed) return <PasswordPrompt onAuth={() => { setAuthed(true); localStorage.setItem("adminAuthed", "1"); }} />;

  const handleDelete = async (id) => {
    if (!confirm("Hapus posting ini?")) return;
    await supabase.from("posts").delete().eq("id", id);
    loadPosts();
  };

  return (
    <div style={{ minHeight:"100vh", background:T.cream }}>
      <div style={{ background:T.greenDeep, padding:"16px 40px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:T.white }}>Admin — Berita & Kegiatan</div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <a href="/" style={{ fontSize:13, color:"rgba(255,255,255,.7)", textDecoration:"none" }}>← Lihat Situs</a>
          <button onClick={() => { setAuthed(false); localStorage.removeItem("adminAuthed"); }}
            style={{ padding:"6px 16px", background:"rgba(255,255,255,.1)", color:T.white, border:"1px solid rgba(255,255,255,.2)", borderRadius:4, cursor:"pointer", fontSize:12 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.greenDeep, marginBottom:4 }}>Semua Posting</h2>
            <p style={{ fontSize:13, color:T.ink3 }}>{posts.length} item</p>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            style={{ padding:"10px 24px", background:T.greenDeep, color:T.white, border:"none", borderRadius:4, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            + Tambah Baru
          </button>
        </div>

        {posts.length === 0 && (
          <div style={{ textAlign:"center", padding:60, color:T.ink3, border:"1px dashed rgba(0,0,0,.1)", borderRadius:8 }}>
            Belum ada posting. Klik "Tambah Baru" untuk memulai.
          </div>
        )}

        {posts.map(post => (
          <div key={post.id} style={{ background:T.white, borderRadius:4, padding:"16px 20px", marginBottom:8, border:"1px solid rgba(0,0,0,.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:16, alignItems:"center" }}>
              {post.image_url
                ? <img src={post.image_url} alt="" style={{ width:44, height:44, borderRadius:4, objectFit:"cover" }} />
                : <div style={{ width:44, height:44, borderRadius:4, background:T.cream2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📄</div>}
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:T.ink2 }}>{post.title}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:4 }}>
                  <span style={{ padding:"1px 6px", borderRadius:2, fontSize:9, fontWeight:700, textTransform:"uppercase", background: post.type === "berita" ? "#DBEAFE" : "#FEF3C7", color: post.type === "berita" ? "#1E40AF" : "#92400E" }}>{post.type}</span>
                  <span style={{ fontSize:11, color:T.ink3 }}>{post.date}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => { setEditing(post); setShowForm(true); }}
                style={{ padding:"6px 14px", background:"transparent", border:"1px solid rgba(0,0,0,.1)", borderRadius:4, cursor:"pointer", fontSize:12 }}>Edit</button>
              <button onClick={() => handleDelete(post.id)}
                style={{ padding:"6px 14px", background:"transparent", border:"1px solid rgba(192,57,43,.3)", color:T.redIkat, borderRadius:4, cursor:"pointer", fontSize:12 }}>Hapus</button>
            </div>
          </div>
        ))}

        {showForm && <PostForm post={editing} onClose={() => setShowForm(false)} onSaved={loadPosts} />}
      </div>
    </div>
  );
}
