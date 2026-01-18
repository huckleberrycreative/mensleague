# Gridiron Guild Admin CMS - Quick Start Guide

## 🚀 Get Up and Running in 15 Minutes

This is your express guide to getting your admin CMS live. For detailed information, see `ADMIN_SETUP.md`.

## Step 1: Create Supabase Project (5 min)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Name it "Gridiron Guild" and create a password
4. Wait for project creation (~2 min)

## Step 2: Set Up Database (3 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the ENTIRE file `supabase/migrations/001_create_league_tables.sql`
4. Click **Run**
5. ✅ You should see "Success. No rows returned"

## Step 3: Configure Environment (2 min)

1. In Supabase, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create `.env.local` in your project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

## Step 4: Create Admin User (2 min)

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and password
4. ✅ Check "Auto Confirm User"
5. Click **Create User**

## Step 5: Set Up Media Storage (2 min)

1. In Supabase, go to **Storage**
2. Click **New Bucket** → Name it `media`
3. ✅ Make it **Public bucket**
4. Click **Create bucket**

## Step 6: Deploy (1 min)

```bash
# Push your code to GitHub
git add .
git commit -m "Add admin CMS"
git push origin main

# In Vercel dashboard:
# 1. Go to your project settings
# 2. Add environment variables (same as .env.local)
# 3. Trigger new deployment
```

## 🎉 You're Done!

Your admin panel is now live at:

**Login**: `https://your-site.vercel.app/admin/login`

Use the email and password you created in Step 4.

## 📋 What You Can Do Now

✅ **Teams** - Manage league teams at `/admin/teams`
✅ **Blog** - Create posts at `/admin/blog`
✅ **Media** - Upload images at `/admin/media`

## 📊 Import Your Data (Optional)

To import your CSV data:

```bash
# Copy CSV files to data folder
mkdir -p data
cp "Historic Regular Season Standings.csv" data/
cp "Historic Playoff Outcomes.csv" data/
cp "Player Salaries.csv" data/

# Make sure .env.local is set up first!
# Then run:
npm run import-data
```

## 🆘 Troubleshooting

**Can't log in?**
- Check that you created the admin user in Supabase
- Verify email/password are correct
- Check browser console for errors

**"Failed to fetch" error?**
- Verify `.env.local` has correct Supabase credentials
- Check that environment variables are set in Vercel

**Media uploads not working?**
- Verify `media` bucket was created in Supabase Storage
- Ensure bucket is set to **Public**

## 📚 Next Steps

- Read `docs/ADMIN_CMS_OVERVIEW.md` for complete feature list
- Check `docs/EXTENDING_ADMIN.md` to add more admin pages
- See `ADMIN_SETUP.md` for detailed documentation

**Need help?** All your documentation is in the `docs/` folder!

---

## Admin URLs

- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Teams**: `/admin/teams`
- **Blog**: `/admin/blog`
- **Media**: `/admin/media`

More admin pages coming soon! Check the dashboard for placeholder links.

---

**Congratulations!** Your fantasy football league now has a professional admin CMS! 🏈 🎉
