-- Check if columns already exist and add them if they don't
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'first_name') THEN
    ALTER TABLE customers ADD COLUMN first_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'last_name') THEN
    ALTER TABLE customers ADD COLUMN last_name TEXT;
  END IF;
END $$;

-- Reset any incorrect values that might be from email usernames
UPDATE customers 
SET 
  first_name = NULL,
  last_name = NULL;

-- Update from name field correctly - split at first space
UPDATE customers 
SET 
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = CASE 
    WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
    ELSE ''
  END
WHERE name IS NOT NULL AND name <> '';

-- Add indexes for better performance on these new columns
CREATE INDEX IF NOT EXISTS idx_customers_first_name ON customers(first_name);
CREATE INDEX IF NOT EXISTS idx_customers_last_name ON customers(last_name);
