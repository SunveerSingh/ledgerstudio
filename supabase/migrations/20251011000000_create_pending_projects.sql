/*
  # Create Pending Projects Table

  ## Overview
  This migration creates a table to store cover art projects created by unauthenticated users
  during the onboarding flow. When users complete the typeform-style questionnaire and generate
  artwork, their data is temporarily stored here until they sign up and authenticate.

  ## New Tables

  ### `pending_projects` - Temporary storage for unauthenticated user projects
  - `id` (uuid, primary key) - Unique identifier for the pending project
  - `session_id` (text) - Browser session identifier to link anonymous users
  - `project_type` (text) - Type: single or album-front
  - `song_title` (text) - Song or album title
  - `artist_name` (text) - Artist name
  - `album_title` (text, optional) - Album title for EP/Album projects
  - `featuring` (text, optional) - Featured artists
  - `producer` (text, optional) - Producer name
  - `release_year` (text, optional) - Release year
  - `genre` (text) - Music genre selection
  - `mood` (text) - Mood/vibe selection
  - `lyrics` (text) - Song lyrics for AI analysis
  - `visual_style` (text) - Selected visual style
  - `additional_prompt` (text, optional) - Additional instructions for AI
  - `tracklist` (jsonb, optional) - Array of tracks for album projects
  - `generated_images` (jsonb) - Array of generated image URLs and metadata
  - `status` (text) - Generation status: pending, generating, completed, failed
  - `is_explicit` (boolean) - Explicit content flag
  - `claimed_by_user_id` (uuid, optional) - References users.id when claimed
  - `created_at` (timestamptz) - Project creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - No RLS policies as this table stores anonymous data
  - Data is public until claimed by authenticated user
  - Cleanup can be done via cron job if needed in future

  ## Important Notes
  1. Data never expires automatically (as per requirements)
  2. Session ID links browser to pending project
  3. Claimed projects can be migrated to authenticated projects table
  4. Generated images stored as JSONB array for flexibility
*/

-- Create pending_projects table
CREATE TABLE IF NOT EXISTS pending_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text NOT NULL,
  project_type text NOT NULL CHECK (project_type IN ('single', 'album-front')),
  song_title text NOT NULL,
  artist_name text NOT NULL,
  album_title text,
  featuring text,
  producer text,
  release_year text,
  genre text NOT NULL,
  mood text NOT NULL,
  lyrics text NOT NULL,
  visual_style text NOT NULL,
  additional_prompt text,
  tracklist jsonb,
  generated_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  is_explicit boolean NOT NULL DEFAULT false,
  claimed_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pending_projects_session_id ON pending_projects(session_id);
CREATE INDEX IF NOT EXISTS idx_pending_projects_status ON pending_projects(status);
CREATE INDEX IF NOT EXISTS idx_pending_projects_created_at ON pending_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_projects_claimed_by_user_id ON pending_projects(claimed_by_user_id);

-- Add trigger for updated_at column
CREATE TRIGGER update_pending_projects_updated_at
  BEFORE UPDATE ON pending_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- No RLS policies needed - this data is accessible to all for anonymous creation
