# Gridiron Guild Admin CMS Setup Guide

This guide will help you set up the custom admin CMS for your Gridiron Guild fantasy football website.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Data Import](#data-import)
6. [Create Admin User](#create-admin-user)
7. [Storage Setup](#storage-setup)
8. [Deployment](#deployment)
9. [Usage](#usage)

## 🎯 Overview

Your custom admin CMS includes:

- **Team Management** - Add/edit/delete league teams
- **Season Management** - Configure league seasons
- **Standings Editor** - Update regular season standings
- **Playoffs Manager** - Manage playoff outcomes and statistics
- **Player Salaries** - Track player contracts and salaries
- **Blog CMS** - Create and publish blog posts
- **Media Library** - Upload and manage images
- **Authentication** - Secure admin access with Supabase Auth

## ✅ Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works great!)
- Your existing Gridiron Guild repository cloned
- GitHub repository access

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in project details:
   - **Name**: Gridiron Guild
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Wait for the project to be created (~2 minutes)

### Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_create_league_tables.sql`
4. Paste into the SQL editor
5. Click **Run** to execute the migration
6. You should see "Success. No rows returned" message

✅ This creates all database tables, indexes, and security policies!

## ⚙️ Environment Configuration

### Step 1: Get Supabase Credentials

In your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project Configuration")
   - **anon public** key (under "Project API keys")

### Step 2: Update Environment Variables

Create or update `.env.local` in your project root:

\`\`\`bash
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
\`\`\`

**Important**: Never commit this file to Git! It should already be in `.gitignore`.

## 📊 Data Import

### Option 1: Manual Import (Recommended for first time)

1. Move your CSV files to the `data` folder:
   ```bash
   mkdir -p data
   mv "Historic Regular Season Standings.csv" data/
   mv "Historic Playoff Outcomes.csv" data/
   mv "Player Salaries.csv" data/
   ```

2. Install dependencies if you haven't:
   ```bash
   npm install
   ```

3. Run the import script:
   ```bash
   npx ts-node scripts/import-csv-data.ts
   ```

This will import:
- All teams (Ben, Aicklen, Carlos, etc.)
- Seasons (2017-2025)
- Regular season standings
- Players and salaries

### Option 2: Import via Admin Panel

After logging in to the admin panel, you can also:
1. Manually add teams via the Teams page
2. Create seasons via the Seasons page
3. Enter data using the web forms

## 👤 Create Admin User

You need to create an admin user to log in:

### Using Supabase Dashboard (Easiest):

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter:
   - **Email**: your-email@example.com
   - **Password**: (create a secure password)
   - **Auto Confirm**: ✅ Enable this
4. Click **Create User**

✅ You can now log in with this email and password!

### Alternative: Sign Up Page (Optional)

If you want to add a public sign-up page, let me know and I can create one.

## 🖼️ Storage Setup (For Media Library)

To enable file uploads in the media library:

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Create a bucket named: `media`
4. Set it to **Public bucket** ✅
5. Click **Create bucket**

6. Go to **Policies** tab for the `media` bucket
7. Click **New Policy** → **For full customization**
8. Create policy for uploads:
   - **Policy name**: Allow authenticated uploads
   - **Allowed operation**: INSERT
   - **Target roles**: authenticated
   - **Policy definition**: `true`
9. Create policy for public reads:
   - **Policy name**: Allow public reads
   - **Allowed operation**: SELECT
   - **Target roles**: public
   - **Policy definition**: `true`

## 🚀 Deployment

Your admin CMS is already integrated into your existing app!

### Deploy to Vercel:

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add admin CMS"
   git push origin main
   ```

2. In Vercel dashboard:
   - Go to your project settings
   - Go to **Environment Variables**
   - Add the two Supabase variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Click **Save**
   - Trigger a new deployment

3. Wait for deployment to complete

✅ Your admin panel will be live at: `https://your-site.vercel.app/admin/login`

## 📱 Usage

### Accessing the Admin Panel

1. Navigate to: `https://your-site.vercel.app/admin/login`
2. Enter your admin email and password
3. You'll be redirected to the dashboard

### Admin Panel Features:

#### Teams Management (`/admin/teams`)
- View all teams
- Add new teams
- Edit team names and owners
- Delete teams

#### Blog Posts (`/admin/blog`)
- Create new blog posts
- Edit existing posts
- Publish/unpublish posts
- Delete posts
- Auto-generate URL slugs from titles

#### Media Library (`/admin/media`)
- Upload images
- View all uploaded media
- Copy media URLs for use in blog posts
- Add alt text for accessibility
- Delete media files

#### Additional Sections (Coming soon):
- Seasons management
- Standings editor
- Playoffs manager
- Player salaries editor

### Managing Content:

#### Creating a Blog Post:
1. Go to `/admin/blog`
2. Click **Add Post**
3. Enter title (slug auto-generates)
4. Add excerpt and content
5. Optionally add featured image URL
6. Check "Publish immediately" or save as draft
7. Click **Create**

#### Uploading Media:
1. Go to `/admin/media`
2. Click **Choose File**
3. Select an image
4. Click **Upload**
5. Once uploaded, click **Copy URL** to use in blog posts

#### Updating Team Information:
1. Go to `/admin/teams`
2. Click edit icon (✏️) next to a team
3. Update name or owner
4. Click **Update**

## 🔐 Security Best Practices

1. **Use Strong Passwords**: Create complex passwords for admin accounts
2. **Enable 2FA**: Enable two-factor auth in Supabase if possible
3. **Limit Admin Users**: Only create admin accounts for trusted users
4. **Regular Backups**: Supabase provides automatic backups on paid plans
5. **Keep Dependencies Updated**: Run `npm update` regularly

## 🆘 Troubleshooting

### "Failed to fetch" errors:
- Check that environment variables are set correctly
- Verify Supabase project is active
- Check browser console for specific errors

### Can't log in:
- Verify admin user was created in Supabase
- Check email/password are correct
- Ensure RLS policies are enabled (they are by default)

### Media uploads failing:
- Verify `media` storage bucket exists
- Check bucket is set to public
- Verify storage policies are configured

### Data not showing:
- Check that migration was run successfully
- Verify data was imported correctly
- Check browser console for API errors

## 📞 Support

For issues specific to:
- **Supabase**: Check [Supabase Docs](https://supabase.com/docs)
- **React/Vite**: Check [Vite Docs](https://vitejs.dev)
- **Deployment**: Check [Vercel Docs](https://vercel.com/docs)

## 🎉 Next Steps

Once your admin CMS is set up:

1. Import your historical data
2. Create your first blog post
3. Upload team logos to media library
4. Update current season standings
5. Add new players/salaries as needed

**Your admin panel is ready to use!** 🚀

---

## Admin Routes Reference

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main admin dashboard
- `/admin/teams` - Team management
- `/admin/blog` - Blog post management
- `/admin/media` - Media library
- `/admin/seasons` - Seasons (placeholder)
- `/admin/standings` - Standings editor (placeholder)
- `/admin/playoffs` - Playoffs manager (placeholder)
- `/admin/salaries` - Player salaries (placeholder)

More admin pages can be added by creating new components in `/src/pages/admin/` and adding routes in `App.tsx`.
