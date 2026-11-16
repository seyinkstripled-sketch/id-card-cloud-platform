# Production Deployment Guide: ID Studio Cloud

This guide provides instructions for deploying the **ID Studio Cloud** platform to major cloud hosting providers (Vercel, Railway, Render) with custom domain configuration and SSL termination.

---

## 1. Deploying to Vercel (Recommended for Next.js)

Vercel is the native platform for Next.js and provides instant global CDN caching, automatic SSL, and zero-configuration serverless functions.

### Step 1: Push Code to GitHub / GitLab
```bash
git init
git add .
git commit -m "feat: complete professional ID card management platform"
git branch -M main
git remote add origin https://github.com/<your-username>/id-card-cloud-platform.git
git push -u origin main
```

### Step 2: Import Project in Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your repository `id-card-cloud-platform`.
4. Framework Preset will automatically detect **Next.js**.

### Step 3: Configure Environment Variables
In the **Environment Variables** section, add:
| Key | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/idstudio?sslmode=require` | Connection string for cloud database (Supabase, Neon, or NeonDB) |
| `JWT_SECRET` | `generate-a-strong-32-character-secret-key-here` | Secret for signing JWT authentication tokens |
| `NEXT_PUBLIC_APP_URL` | `https://idcard.fthidoekiti.gov.ng` | Production base URL |

### Step 4: Deploy & Seed Database
1. Click **Deploy**.
2. After deployment finishes, open the Vercel CLI or run migrations via:
```bash
npx prisma db push
node scripts/seed.js
```

---

## 2. Deploying to Railway

Railway provides integrated PostgreSQL databases and continuous containerized deployments.

### Step 1: Create a Railway Project
1. Log in to [Railway](https://railway.app).
2. Click **New Project** → **Provision PostgreSQL**.
3. Once the database is created, click **New** → **GitHub Repo** → select `id-card-cloud-platform`.

### Step 2: Set Variables in Railway
1. Navigate to the web service **Variables** tab.
2. Link the database reference:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET`: `<your-random-32-char-key>`
   - `NODE_ENV`: `production`

### Step 3: Build & Start Command
Railway automatically detects `package.json`:
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`

---

## 3. Custom Domain & HTTPS Setup

To connect a custom domain such as `idcard.fthidoekiti.gov.ng`:

1. In your Vercel or Railway Dashboard, go to **Settings** → **Domains**.
2. Enter your custom domain: `idcard.fthidoekiti.gov.ng`.
3. Add the corresponding DNS records at your domain registrar (e.g., Cloudflare, Namecheap, GoDaddy):
   - **For Subdomains (`idcard.fthidoekiti.gov.ng`):**
     - Type: `CNAME`
     - Name: `idcard`
     - Value: `cname.vercel-dns.com` (or Railway provided endpoint)
   - **For Apex Domain (`fthidoekiti.gov.ng`):**
     - Type: `A`
     - Value: `76.76.21.21` (Vercel IP)
4. DNS propagation typically takes 2–15 minutes. Vercel and Railway automatically provision free Let's Encrypt SSL/TLS certificates.

---

## 4. Health Check & Live Verification

Once deployed, verify that the deployment is operating correctly:
1. **Public Health:** Navigate to `https://<your-domain>/` (Status 200).
2. **Public QR Portal:** Navigate to `https://<your-domain>/verify/P6014` to confirm staff verification.
3. **Admin Sign In:** Navigate to `https://<your-domain>/login` and sign in with `admin@idstudio.gov.ng`.
