# Dashboard Troubleshooting Guide

## Quick Fix Steps

### 1. Set Up Supabase Database
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL script

### 2. Verify Environment Variables
Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test Database Connection
1. Start your development server: `npm run dev`
2. Open browser console (F12)
3. Navigate to `/dashboard`
4. Check console logs for errors

## Common Issues & Solutions

### Issue: Dashboard shows "Loading..." indefinitely
**Possible Causes:**
- Missing database tables
- Wrong environment variables
- Authentication not working

**Solution:**
1. Run the `supabase-setup.sql` script
2. Check browser console for specific errors
3. Verify you're signed in (try signing out and back in)

### Issue: "Customer not found" error
**Cause:** The customer record doesn't exist in the database

**Solution:**
- The app should automatically create a customer record
- Check Supabase logs for any RLS policy violations
- Ensure the `customers` table exists

### Issue: Orders not loading
**Possible Causes:**
- Missing `orders`, `order_items`, or `menu_items` tables
- RLS policies blocking access
- API route not working

**Solution:**
1. Check if tables exist in Supabase
2. Test the API route directly: `/api/orders/customer`
3. Check browser network tab for 404/500 errors

### Issue: Authentication redirect loop
**Cause:** User session not persisting

**Solution:**
1. Clear browser cookies/localStorage
2. Check Supabase auth settings
3. Verify middleware configuration

## Testing Checklist

- [ ] Database tables exist
- [ ] Sample menu items are inserted
- [ ] Environment variables are set
- [ ] You can sign in/sign up
- [ ] Customer record gets created
- [ ] API routes return data
- [ ] Dashboard loads without errors

## Debug Commands

```bash
# Check if tables exist in your Supabase project
# Go to Supabase > Table Editor and verify these tables exist:
# - customers
# - orders 
# - order_items
# - menu_items

# Test API route directly
curl -X GET http://localhost:3000/api/orders/customer \
  -H "Cookie: your-auth-cookie"
```

## Expected Database Schema

### customers
- id (UUID, Primary Key)
- auth_id (UUID, Foreign Key to auth.users)
- name (Text)
- email (Text)
- points (Integer, default 0)
- role (Text, default 'customer')
- created_at (Timestamp)

### orders
- id (UUID, Primary Key)
- customer_id (UUID, Foreign Key to customers.id)
- total_price (Decimal)
- status (Text, default 'pending')
- created_at (Timestamp)

### order_items
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key to orders.id)
- menu_item_id (UUID, Foreign Key to menu_items.id)
- quantity (Integer)
- price_each (Decimal)

### menu_items
- id (UUID, Primary Key)
- name (Text)
- description (Text)
- price (Decimal)
- image_url (Text)
- category (Text)
- available (Boolean, default true)
- created_at (Timestamp)
