# 🚀 SmartBio Backend Setup

Your smart-link platform is ready! Follow these steps to connect your Supabase backend and launch:

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **API Key (anon)**.
3. Paste them into `.env.local` in this folder.

### 2. Initialize Database
Download/Copy the `database_schema.sql` file from this folder and paste it into the **Supabase SQL Editor**. 
Run it to create all tables:
- `profiles`: User information & theme choice.
- `links`: The actual link tree items.
- `link_rules`: The "Smart" logic (time-based, click-based).
- `analytics`: Tracking for deep insights.

### 3. Setup Authentication (Optional but Recommended)
Enable Email/Password or Gmail login in the Supabase Dashboard -> Authentication -> Providers.

### 4. Vibe-Check Features
- **Smart Reordering**: Links with more clicks automatically move higher.
- **Time-Based rules**: Hide "Swedish Discount" during Swedish night time.
- **Glassmorphism Design**: High-end look without custom CSS bloat.

### 5. Deployment
Push this folder to a GitHub repository and connect it to **Vercel**. It will auto-deploy everything!

---
*Built with love for creators.*
