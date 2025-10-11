/*
  # Add INSERT policy for users table

  1. Security
    - Add policy to allow authenticated users to insert their own profile
    - This is needed during signup when a new user creates their profile
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON users
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
