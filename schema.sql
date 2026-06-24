-- Supabase Schema for Berita & Kegiatan
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create posts table
create table if not exists posts (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  content     text default '',
  image_url   text default '',
  date        date default current_date,
  type        text not null check (type in ('berita', 'kegiatan')),
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table posts enable row level security;

-- Allow all operations for anon key
-- Security relies on UI-level password gate on /admin
create policy "Allow all for anon" on posts
  for all using (true) with check (true);
