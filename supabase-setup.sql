-- ============================================
-- Shuto — Supabase Setup
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create notes table
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Sans titre',
  content text not null default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Create files table
create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  storage_path text not null default '',
  size bigint not null default 0,
  mime_type text not null default '',
  folder text not null default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Enable RLS
alter table public.notes enable row level security;
alter table public.files enable row level security;

-- 4. RLS Policies for notes
create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- 5. RLS Policies for files
create policy "Users can view their own files"
  on public.files for select
  using (auth.uid() = user_id);

create policy "Users can insert their own files"
  on public.files for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own files"
  on public.files for update
  using (auth.uid() = user_id);

create policy "Users can delete their own files"
  on public.files for delete
  using (auth.uid() = user_id);

-- 6. Create storage bucket (run this separately if needed)
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict do nothing;

-- 7. Storage RLS policies
create policy "Users can upload their own files"
  on storage.objects for insert
  with check (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view their own files"
  on storage.objects for select
  using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own files"
  on storage.objects for delete
  using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
