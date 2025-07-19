-- Setup Password Reset Functionality
-- Run this in your Supabase SQL Editor to enable password reset

-- ==========================================
-- 1. CREATE PASSWORD RESET TOKENS TABLE
-- ==========================================

-- Create password reset tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token UUID NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires);

-- ==========================================
-- 2. ADD PASSWORD FIELD TO CUSTOMERS TABLE
-- ==========================================

-- Add password field to customers table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' 
    AND column_name = 'password'
  ) THEN
    ALTER TABLE customers ADD COLUMN password TEXT;
  END IF;
END $$;

-- Add updated_at field to customers table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE customers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS on password reset tokens table
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow access to own tokens (for security)
DROP POLICY IF EXISTS "password_reset_tokens_policy" ON password_reset_tokens;
CREATE POLICY "password_reset_tokens_policy" ON password_reset_tokens
FOR ALL USING (
  -- Allow access if the email matches the authenticated user's email
  email = (SELECT email FROM customers WHERE auth_id = auth.uid())
  -- Or if the user is an admin
  OR EXISTS (
    SELECT 1 FROM customers 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'kitchen')
  )
);

-- ==========================================
-- 4. CLEANUP OLD TOKENS FUNCTION
-- ==========================================

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_password_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM password_reset_tokens 
  WHERE expires < NOW() OR used = TRUE;
END;
$$;

-- ==========================================
-- 5. VERIFICATION QUERIES
-- ==========================================

-- Check if tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name = 'customers' THEN 'Main user table'
    WHEN table_name = 'password_reset_tokens' THEN 'Password reset tokens'
    ELSE 'Other table'
  END as description
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'password_reset_tokens')
ORDER BY table_name;

-- Check customers table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customers'
AND column_name IN ('id', 'email', 'password', 'updated_at', 'auth_id')
ORDER BY column_name;

-- Check password reset tokens table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'password_reset_tokens'
ORDER BY ordinal_position;

-- ==========================================
-- SUCCESS MESSAGE
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Password reset setup complete!';
  RAISE NOTICE '🔑 Password reset tokens table created';
  RAISE NOTICE '👤 Customer table updated with password field';
  RAISE NOTICE '🔒 Row Level Security enabled';
  RAISE NOTICE '🧹 Cleanup function created';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Test the forgot password functionality';
  RAISE NOTICE '   2. Verify email sending works';
  RAISE NOTICE '   3. Test password reset flow';
END $$;
