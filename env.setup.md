# Local Environment Setup for La Casita App

To ensure authentication works correctly in both development and production environments, you need to set up the following environment variables:

## For Local Development

Create or update your `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=https://tpoqcxqyolnrkekdnorj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwb3FjeHF5b2xucmtla2Rub3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTc1OTksImV4cCI6MjA2NTg3MzU5OX0.lefMCOcrGhZIvfB3W9-vpd_wTCUu6GRzl-Gr4IqQ8TA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## For Production (Already Set in netlify.toml)

```
NEXT_PUBLIC_SUPABASE_URL=https://tpoqcxqyolnrkekdnorj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwb3FjeHF5b2xucmtla2Rub3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTc1OTksImV4cCI6MjA2NTg3MzU5OX0.lefMCOcrGhZIvfB3W9-vpd_wTCUu6GRzl-Gr4IqQ8TA
NEXT_PUBLIC_SITE_URL=https://la-casita-restaurant.windsurf.build
```

## Why This Matters

The `NEXT_PUBLIC_SITE_URL` environment variable is crucial for authentication flows:

1. **Email Confirmation**: When users sign up, they receive an email with a confirmation link that needs to redirect back to your application
2. **Password Reset**: When users request a password reset, the email link must redirect to your application's password reset page
3. **OAuth Authentication**: If you implement social logins, the OAuth provider needs to know where to redirect after authentication

Without the correct site URL, authentication flows will try to redirect to localhost in production or vice versa, causing errors.
