-- Migration: Add folder, pinned, tags to notes + create note_folders table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Add new columns to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS folder text DEFAULT '';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create note_folders table
CREATE TABLE IF NOT EXISTS note_folders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  parent_folder text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;

-- RLS policy for note_folders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'note_folders' AND policyname = 'Users can manage own note folders'
  ) THEN
    CREATE POLICY "Users can manage own note folders" ON note_folders FOR ALL USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Index for faster folder queries
CREATE INDEX IF NOT EXISTS idx_notes_folder ON notes(folder);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned);
CREATE INDEX IF NOT EXISTS idx_note_folders_parent ON note_folders(parent_folder);
