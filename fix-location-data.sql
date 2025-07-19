-- Fix Location Data Script
-- This script identifies and fixes inconsistent location data in orders

-- ==========================================
-- 1. IDENTIFY LOCATION ISSUES
-- ==========================================

-- Check all unique location values in order notes
SELECT 
  DISTINCT notes::jsonb->>'location' as location_value,
  COUNT(*) as order_count
FROM orders 
WHERE notes IS NOT NULL 
  AND notes::jsonb->>'location' IS NOT NULL
GROUP BY notes::jsonb->>'location'
ORDER BY order_count DESC;

-- ==========================================
-- 2. SHOW PROBLEMATIC ORDERS
-- ==========================================

-- Show orders with 'la-casita' or other non-standard location values
SELECT 
  id,
  created_at,
  status,
  notes::jsonb->>'location' as current_location,
  CASE 
    WHEN LOWER(notes::jsonb->>'location') LIKE '%berthoud%' THEN 'Berthoud'
    WHEN LOWER(notes::jsonb->>'location') LIKE '%fort collins%' OR LOWER(notes::jsonb->>'location') LIKE '%fortcollins%' THEN 'Fort Collins'
    WHEN LOWER(notes::jsonb->>'location') = 'la-casita' OR LOWER(notes::jsonb->>'location') = 'lacasita' THEN 'Berthoud'
    ELSE notes::jsonb->>'location'
  END as suggested_location
FROM orders 
WHERE notes IS NOT NULL 
  AND notes::jsonb->>'location' IS NOT NULL
  AND notes::jsonb->>'location' NOT IN ('Berthoud', 'Fort Collins')
ORDER BY created_at DESC;

-- ==========================================
-- 3. FIX LOCATION DATA (UNCOMMENT TO EXECUTE)
-- ==========================================

-- WARNING: This will modify your data. Test first!
-- Uncomment the following lines to fix location data:

/*
-- Fix 'la-casita' to 'Berthoud' (assuming it's test data for Berthoud location)
UPDATE orders 
SET notes = jsonb_set(
  notes::jsonb, 
  '{location}', 
  '"Berthoud"'
)
WHERE notes IS NOT NULL 
  AND (
    LOWER(notes::jsonb->>'location') = 'la-casita' OR 
    LOWER(notes::jsonb->>'location') = 'lacasita'
  );

-- Fix other variations
UPDATE orders 
SET notes = jsonb_set(
  notes::jsonb, 
  '{location}', 
  CASE 
    WHEN LOWER(notes::jsonb->>'location') LIKE '%berthoud%' THEN '"Berthoud"'
    WHEN LOWER(notes::jsonb->>'location') LIKE '%fort collins%' OR LOWER(notes::jsonb->>'location') LIKE '%fortcollins%' THEN '"Fort Collins"'
    ELSE notes::jsonb->>'location'
  END::jsonb
)
WHERE notes IS NOT NULL 
  AND notes::jsonb->>'location' IS NOT NULL
  AND notes::jsonb->>'location' NOT IN ('Berthoud', 'Fort Collins');
*/

-- ==========================================
-- 4. VERIFICATION QUERIES
-- ==========================================

-- Check the results after running the fixes
SELECT 
  notes::jsonb->>'location' as location,
  COUNT(*) as order_count,
  MIN(created_at) as earliest_order,
  MAX(created_at) as latest_order
FROM orders 
WHERE notes IS NOT NULL 
  AND notes::jsonb->>'location' IS NOT NULL
GROUP BY notes::jsonb->>'location'
ORDER BY order_count DESC;

-- Show recent orders by location
SELECT 
  id,
  created_at,
  status,
  notes::jsonb->>'location' as location,
  LEFT(notes::jsonb->>'customerInfo'::text, 50) as customer_preview
FROM orders 
WHERE notes IS NOT NULL 
  AND notes::jsonb->>'location' IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- ==========================================
-- SUCCESS MESSAGE
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Location data analysis complete!';
  RAISE NOTICE '📍 Review the results above to identify any location inconsistencies';
  RAISE NOTICE '🔧 Uncomment the UPDATE statements to fix the data if needed';
  RAISE NOTICE '⚠️  Always backup your data before running UPDATE statements!';
END $$;
