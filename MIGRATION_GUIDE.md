# Firebase to Supabase Migration Guide

## Overview

This guide documents the complete migration from Firebase to Supabase for Ledger Studio. The migration includes authentication, database, storage, and adds Stripe subscription management.

## What Changed

### ✅ Completed Migrations

1. **Authentication System**
   - Migrated from Firebase Auth to Supabase Auth
   - All auth flows (signup, login, logout) now use Supabase
   - Session management handled by Supabase JWT tokens

2. **Database**
   - Migrated from Firestore to PostgreSQL (Supabase)
   - New schema with proper relationships and constraints
   - Row Level Security (RLS) enabled on all tables
   - Real-time subscriptions available for projects

3. **Storage**
   - Migrated from Firebase Storage to Supabase Storage
   - Organized into buckets: user-avatars, project-thumbnails, project-exports, project-assets
   - Public and private file access control

4. **New Features**
   - Stripe subscription management
   - Payment processing and history tracking
   - Usage limits based on subscription tiers
   - Billing portal integration

### 🗑️ Removed

- All Firebase dependencies (firebase package removed)
- Firebase configuration files
- Firestore service files
- Firebase Auth services

### 📦 Added

- Supabase client library
- New Supabase services (auth, projects, storage, stripe)
- Subscription management UI components
- Stripe webhook handlers (Edge Functions)

## Database Schema

### Tables Created

1. **users** - User profiles with subscription info
2. **projects** - Creative projects (covers and visualizers)
3. **project_exports** - Generated export files
4. **subscriptions** - Stripe subscription tracking
5. **payment_history** - Payment transaction records

All tables have RLS enabled and proper policies for data isolation.

## Environment Variables

### Before (Firebase)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### After (Supabase)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=... (optional, for Stripe)
```

## Stripe Setup

### Required Configuration

1. **Create Stripe Account** at https://stripe.com

2. **Get API Keys** from Stripe Dashboard

3. **Configure Webhook Endpoint**
   - URL: `https://your-project.supabase.co/functions/v1/stripe-webhooks`
   - Events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

4. **Create Products in Stripe**
   - Pro Plan: $19/month
   - Premium Plan: $49/month

5. **Set Environment Variables** (Supabase Edge Functions)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
   - `STRIPE_PRO_PRICE_ID` - Price ID for Pro plan
   - `STRIPE_PREMIUM_PRICE_ID` - Price ID for Premium plan

## Subscription Tiers

### Free Tier
- 3 AI cover generations per month
- 2 projects max
- Basic export options
- Community support

### Pro Tier ($19/month)
- Unlimited AI generations
- Unlimited projects
- HD exports
- Priority support
- Advanced visualizer features

### Premium Tier ($49/month)
- Everything in Pro
- Custom branding
- API access
- White-label exports
- Dedicated support
- Early access to features

## Supabase Storage Buckets

You need to create these storage buckets in Supabase Dashboard:

1. **user-avatars** (Public)
   - User profile pictures

2. **project-thumbnails** (Public)
   - Project preview images

3. **project-exports** (Private)
   - Generated exports for download

4. **project-assets** (Private)
   - User-uploaded assets

## Testing the Migration

### 1. Test Authentication
- [ ] Sign up new user
- [ ] Login with existing credentials
- [ ] Logout
- [ ] Password reset flow

### 2. Test Projects
- [ ] Create new project
- [ ] Update project settings
- [ ] Delete project
- [ ] Duplicate project

### 3. Test Storage
- [ ] Upload project thumbnail
- [ ] Upload user avatar
- [ ] Delete uploaded files

### 4. Test Subscriptions (if Stripe configured)
- [ ] View subscription plans
- [ ] Upgrade to Pro plan
- [ ] Access billing portal
- [ ] View payment history

## Data Migration (Optional)

If you have existing Firebase data to migrate:

1. **Export Firebase Data**
   ```bash
   # Use Firebase Admin SDK to export users and projects
   ```

2. **Transform Data**
   - Map Firebase user IDs to Supabase auth IDs
   - Convert Firestore documents to PostgreSQL rows
   - Update field names to match new schema (camelCase → snake_case)

3. **Import to Supabase**
   ```sql
   -- Use Supabase SQL Editor to bulk insert data
   INSERT INTO users (id, email, artist_name, ...) VALUES (...);
   INSERT INTO projects (user_id, title, type, ...) VALUES (...);
   ```

## Rollback Plan

If you need to rollback:

1. Restore `firebase` package in package.json
2. Restore Firebase config and service files from git history
3. Revert AuthContext and ProjectContext changes
4. Restore old environment variables
5. Run `npm install` and `npm run build`

## Support

For issues with:
- **Supabase**: Check Supabase Dashboard logs and documentation
- **Stripe**: Review Stripe Dashboard and webhook logs
- **Migration**: Check browser console and network tab for errors

## Next Steps

1. ✅ Update environment variables with production keys
2. ✅ Create Supabase Storage buckets
3. ✅ Configure Stripe webhook endpoint
4. ✅ Test all authentication flows
5. ✅ Test project creation and management
6. ✅ Test subscription flows (if using Stripe)
7. ✅ Deploy to production

## Benefits of Migration

- **Better Performance**: PostgreSQL is faster than Firestore for complex queries
- **Cost Predictability**: Supabase pricing is more predictable
- **SQL Power**: Full SQL capabilities for reporting and analytics
- **Real-time**: Built-in real-time subscriptions for live updates
- **Better Relations**: Proper foreign keys and relationships
- **Stripe Integration**: Native support for subscription billing
- **Type Safety**: Generated TypeScript types from database schema

## Conclusion

The migration from Firebase to Supabase is complete. All core functionality has been preserved and enhanced with subscription management capabilities. The application is now built on a more powerful, cost-effective, and developer-friendly stack.
