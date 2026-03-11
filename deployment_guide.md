# Deployment Guide: Dynamic QR Code SaaS Platform

This guide outlines how to deploy the platform into a production environment.

## 1. Database (Supabase)
1.  Go to Supabase and create a new project.
2.  Navigate to the **SQL Editor** and run the `backend/schema.sql` file to create your tables and RLS policies.
3.  Go to **Authentication** -> **Providers** and enable Google OAuth if needed.
4.  Copy your `SUPABASE_URL` and `SUPABASE_KEY` (Anon Key and Service Role Key).

## 2. Backend (Render / Railway)
1.  Push your code to a GitHub repository.
2.  Create a new Web Service on Render or Railway.
3.  Set the Root Directory to `backend/`.
4.  Set the Build Command: `pip install -r requirements.txt`.
5.  Set the Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
6.  Add the following Environment Variables in the hosting provider's dashboard:
    -   `SUPABASE_URL`: Your Supabase project URL.
    -   `SUPABASE_KEY`: Your Supabase service role key (or anon key depending on your choice).
    -   `DOMAIN`: The URL where the backend is hosted (e.g., `https://api.yourdomain.com`). This is important for the short links.

## 3. Frontend (Vercel)
1.  Create a new project on Vercel and connect your GitHub repository.
2.  Set the Framework Preset to **Vite**.
3.  Set the Root Directory to `frontend/`.
4.  The Build Command will automatically be `npm run build` and Output Directory `dist`.
5.  Add the following Environment Variables:
    -   `VITE_SUPABASE_URL`: Your Supabase URL.
    -   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
    -   `VITE_API_URL`: The URL of your deployed FastAPI backend (e.g., `https://api.yourdomain.com/api`).
    -   `VITE_SHORT_LINK_DOMAIN`: Optional, the domain you use for tracking (e.g., `qr.yourdomain.com`).
6.  Deploy the application.

## 4. Final Testing
1.  Visit the Vercel frontend URL.
2.  Test the Supabase Auth login flow.
3.  Generate a dynamic QR code.
4.  Verify that scanning the QR code redirects correctly through the Render backend and logs the internal scan analytics.
