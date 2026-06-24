# Berita & Kegiatan — Design Spec

## Overview

Add a "Berita & Kegiatan" (News & Activities) feature to the Dinas Perpustakaan dan Kearsipan Kab. Sumba Barat website. Users can view posts on the main page; an admin can create, edit, and delete posts via a protected `/admin` route.

---

## Architecture

```
Frontend (Vite SPA)
├── /                → Main site + BeritaKegiatan section
├── /admin           → Admin CRUD (password-gated)
└── Supabase         → posts table
    └── Google Drive → images via Google Apps Script webhook
```

### Technology choices

| Layer | Choice | Why |
|-------|--------|-----|
| Routing | react-router-dom v7 | SPA in one bundle, one deploy |
| Auth (admin) | Hardcoded password prompt | Simple, no extra infra |
| Database | Supabase (Postgres) | User requested it |
| Image storage | Google Drive via Apps Script | User requested it |

---

## Database Schema (Supabase)

### Table: `posts`

```sql
create table posts (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  content     text default '',
  image_url   text default '',
  date        date default current_date,
  type        text not null check (type in ('berita', 'kegiatan')),
  created_at  timestamptz default now()
);
```

- RLS: enable. Policy: allow all operations for anon key (security relies on UI-level password gate on `/admin`). For a government profile site, this is a pragmatic trade-off.

---

## Google Apps Script (Image Upload)

### Endpoint

A Google Apps Script Web App deployed with "Anyone" access.

### Request

```
POST <GAS_URL>
Content-Type: multipart/form-data

file: <image binary>
```

### Response

```json
{
  "success": true,
  "url": "https://drive.google.com/uc?export=view&id=FILE_ID",
  "fileId": "FILE_ID"
}
```

### Implementation

```javascript
// Google Apps Script — Image Upload Handler
function doPost(e) {
  const folderName = "Perpus Sumba Barat — Images";
  const folder = DriveApp.getFoldersByName(folderName).hasNext()
    ? DriveApp.getFoldersByName(folderName).next()
    : DriveApp.createFolder(folderName);

  const blob = e.parameter.file ? Utilities.newBlob(
    Utilities.base64Decode(e.parameter.file),
    e.parameter.mimeType || "image/jpeg",
    e.parameter.fileName || "upload.jpg"
  ) : null;

  if (!blob) return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No file" }))
    .setMimeType(ContentService.MimeType.JSON);

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const fileId = file.getId();

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    url: `https://drive.google.com/uc?export=view&id=${fileId}`,
    fileId
  })).setMimeType(ContentService.MimeType.JSON);
}
```

---

## Component Tree

### Main Page — BeritaKegiatanSection

```
BeritaKegiatanSection
├── Eyebrow ("Berita & Kegiatan")
├── SectionH2
├── Filter tabs: [Semua, Berita, Kegiatan]
└── Grid of PostCard
    ├── Thumbnail (image_url or placeholder)
    ├── Date badge
    ├── Title
    ├── Type label (berita/kegiatan)
    └── Excerpt (content, first 120 chars)
       └── onClick → open PostModal (full content)
```

### Admin Page — AdminPage

```
AdminPage
├── (if not authed) PasswordPrompt
│   └── Text input + submit → verify against hardcoded key
└── (if authed) AdminDashboard
    ├── Header — title + logout button
    ├── "Tambah Baru" button → open PostForm
    ├── List of posts (table)
    │   └── Each row: title, type, date, [Edit] [Delete]
    └── PostForm (modal or inline)
        ├── Title input
        ├── Type select (berita/kegiatan)
        ├── Date input
        ├── Image upload (file input → GAS → get URL)
        ├── Content textarea
        └── Submit / Cancel
```

---

## State Management

- No global state library needed.
- `BeritaKegiatanSection` fetches from Supabase on mount.
- `AdminDashboard` fetches list on mount, refreshes after CRUD.
- Supabase client initialized once with anon key.

---

## Image Upload Flow

```
User picks file in <input type="file">
  → readAsDataURL → send base64 to GAS endpoint
    → GAS saves to Drive, returns public URL
  → set image_url = returned URL
  → save post data to Supabase
```

---

## Security

- Admin page: hardcoded password prompt (stored as a const, set at build time).
- Supabase: RLS enabled with permissive policy for anon key — security through UI gate only. Acceptable for a government profile site.
- GAS: deployed with "Anyone" access. Relies on obscurity of URL. Could add a shared secret in future if needed.

---

## File Changes

| File | Action |
|------|--------|
| `package.json` | Add `@supabase/supabase-js`, `react-router-dom` |
| `src/supabase.js` | New — Supabase client init (anon key) |
| `src/BeritaKegiatanSection.jsx` | New — main page section (grid, tab filter, PostCard, PostModal) |
| `src/AdminPage.jsx` | New — admin page (PasswordPrompt, table, PostForm) |
| `src/App.jsx` | Add react-router-dom `<BrowserRouter>`, `/` and `/admin` routes, import new sections |
| `gas/upload.gs` | New — Google Apps Script for Drive image upload |
