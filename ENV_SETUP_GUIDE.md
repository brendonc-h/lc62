# Environment Setup Guide

## Fix Google OAuth Redirect Issues

To ensure Google OAuth sign-in redirects correctly in production, please update your `.env.local` file with the correct site URL:

```
# For local development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# For production (uncomment before deploying)
# NEXT_PUBLIC_SITE_URL=https://your-production-url.netlify.app
```

## Netlify Environment Variables

When deploying to Netlify, make sure to add these environment variables in your Netlify dashboard:

1. Go to Site settings > Build & deploy > Environment
2. Add the following variable:
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: Your production URL (e.g., `https://la-casita-restaurant.netlify.app`)

This will ensure all OAuth redirects work correctly in your production environment.

## Important Notes

- The app now supports both Berthoud and Fort Collins locations
- Admin emails have been updated to include both locations
- Google OAuth sign-in has been fixed to redirect to the home page instead of /dashboard
- All OAuth redirects now use environment variables instead of hardcoded URLs
