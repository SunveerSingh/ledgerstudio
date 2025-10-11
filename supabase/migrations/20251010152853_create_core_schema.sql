/*
  # Ledger Studio Core Database Schema

  ## Overview
  Complete database schema for Ledger Studio music platform including user management,
  project tracking, subscription handling, and payment processing.

  ## New Tables

  ### 1. `users` - User profiles and settings
  - `id` (uuid, primary key) - Matches Supabase auth.users.id
  - `email` (text) - User email address
  - `artist_name` (text) - Display name for artist
  - `primary_genre` (text) - Default music genre
  - `brand_colors` (jsonb) - Array of brand colors
  - `explicit_content` (boolean) - Content rating preference
  - `avatar_url` (text, optional) - Profile picture URL
  - `subscription_tier` (text) - Current plan: free, pro, premium
  - `subscription_status` (text) - Status: active, canceled, past_due, etc.
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `projects` - User creative projects
  - `id` (uuid, primary key) - Project unique identifier
  - `user_id` (uuid, foreign key) - References users.id
  - `title` (text) - Project name
  - `type` (text) - Project type: cover or visualizer
  - `status` (text) - Workflow status: draft, processing, completed, failed
  - `thumbnail_url` (text, optional) - Preview image URL
  - `settings` (jsonb) - Project configuration and metadata
  - `created_at` (timestamptz) - Project creation time
  - `updated_at` (timestamptz) - Last modification time

  ### 3. `project_exports` - Generated output files
  - `id` (uuid, primary key) - Export unique identifier
  - `project_id` (uuid, foreign key) - References projects.id
  - `format` (text) - File format: png, jpg, mp4, etc.
  - `resolution` (text) - Output resolution
  - `file_url` (text) - Storage URL
  - `file_size` (bigint) - File size in bytes
  - `created_at` (timestamptz) - Export creation time

  ### 4. `subscriptions` - Stripe subscription tracking
  - `id` (uuid, primary key) - Subscription record ID
  - `user_id` (uuid, foreign key) - References users.id
  - `stripe_customer_id` (text) - Stripe customer identifier
  - `stripe_subscription_id` (text) - Stripe subscription identifier
  - `plan_id` (text) - Plan identifier: free, pro, premium
  - `status` (text) - Subscription status from Stripe
  - `current_period_start` (timestamptz) - Billing period start
  - `current_period_end` (timestamptz) - Billing period end
  - `cancel_at_period_end` (boolean) - Scheduled cancellation flag
  - `created_at` (timestamptz) - Subscription start time
  - `updated_at` (timestamptz) - Last status update

  ### 5. `payment_history` - Transaction records
  - `id` (uuid, primary key) - Payment record ID
  - `user_id` (uuid, foreign key) - References users.id
  - `subscription_id` (uuid, foreign key, optional) - References subscriptions.id
  - `stripe_payment_intent_id` (text) - Stripe payment identifier
  - `amount` (integer) - Amount in cents
  - `currency` (text) - Currency code (USD, EUR, etc.)
  - `status` (text) - Payment status: succeeded, failed, pending
  - `created_at` (timestamptz) - Payment timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Policies restrict read/write based on authenticated user ID
  - Service role bypasses RLS for admin operations

  ## Indexes
  - User ID indexes on all user-related tables for fast queries
  - Status and timestamp indexes for filtering and sorting
  - Stripe ID indexes for webhook processing

  ## Important Notes
  1. All timestamps use UTC timezone
  2. JSONB fields allow flexible schema evolution
  3. Foreign keys ensure referential integrity
  4. Cascading deletes clean up related records
  5. Default values prevent null issues
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  artist_name text NOT NULL DEFAULT 'New Artist',
  primary_genre text NOT NULL DEFAULT 'Pop',
  brand_colors jsonb NOT NULL DEFAULT '["#8B5CF6", "#06B6D4", "#F59E0B"]'::jsonb,
  explicit_content boolean NOT NULL DEFAULT false,
  avatar_url text,
  subscription_tier text NOT NULL DEFAULT 'free',
  subscription_status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('cover', 'visualizer')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  thumbnail_url text,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Project exports table
CREATE TABLE IF NOT EXISTS project_exports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  format text NOT NULL,
  resolution text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text UNIQUE,
  plan_id text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id text UNIQUE NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_exports_project_id ON project_exports(project_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON payment_history(subscription_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Project exports policies
CREATE POLICY "Users can view own exports"
  ON project_exports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_exports.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own exports"
  ON project_exports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_exports.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own exports"
  ON project_exports FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_exports.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payment history policies
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment records"
  ON payment_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();