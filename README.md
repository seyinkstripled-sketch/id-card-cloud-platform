# Professional ID Card Management & Issuance Platform (ID Studio Cloud)
### Federal Teaching Hospital, Ido-Ekiti — Enterprise Identity Credentialing System

An enterprise-grade, cloud-native web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. Designed and engineered to provide a complete lifecycle for issuing, customizing, managing, verifying, and printing official CR80 employee identity cards.

---

## 🌟 Key Application Features

1. **Authentic CR80 Card Specification (ISO/IEC 7810)**
   - Standard $53.98 \times 85.60\text{ mm}$ portrait dimensions at 300 DPI vector clarity.
   - Dual-side support: High-fidelity **Front** and **Back** renders with clean separation.
   - Distinct green name banner (`#036029`), mint accents (`#A7F3D0`), official Nigerian Coat of Arms, hospital logo, and security watermark.
   - Back side features official terms of service, Chief Medical Director notice, and Code128 barcode.

2. **Interactive Card Studio (`/studio`)**
   - Click-and-drag element positioning and fine-tuning.
   - Live side-by-side customization with real-time vector preview.
   - High-resolution card export and direct printing (`@media print`).

3. **Live Webcam Passport Capture with White Background Processing**
   - Real-time webcam feed with oval face framing guidelines.
   - Automated perimeter luminance analysis to replace backdrops with pure studio white.
   - Adjustable sensitivity controls and fallback image upload.

4. **HTML5 Canvas Digital Signature Pad**
   - High-DPI stroke smoothing for mouse and touch inputs.
   - Transparent PNG output specifically tailored for the dark green card footer.

5. **Instant Public Verification Portal (`/verify/[code]`)**
   - Zero-authentication portal accessible via QR code scan or Staff ID query.
   - Displays verified badge, appointment credentials, validity dates, and SHA-256 integrity signature.

6. **Executive Dashboard & Analytics (`/dashboard`)**
   - Live metrics: Total staff, active cards, expired cards, and security audit volume.
   - Directorate and department breakdown charts.

7. **Role-Based Access Control (RBAC) & Security**
   - User roles: `ADMIN`, `OPERATOR`, and `VIEWER`.
   - Secure HTTP-only cookies and Bearer JWT token support.
   - Bcrypt password hashing (10 rounds) and Zod input validation.
   - Comprehensive immutable security audit logging (`/audit-logs`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | Next.js API Routes (Node.js runtime), Zod Schema Validation |
| **Database & ORM** | Prisma ORM 6.4.0 (SQLite for local zero-config, PostgreSQL/Supabase ready) |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookies, RBAC |
| **Media & QR** | HTML5 Canvas, MediaDevices WebRTC API, QRCode generator |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.18.0 or newer (tested on Node v24)
- **NPM**: v9 or newer

### 2. Installation & Setup
```bash
# Navigate to the project directory
cd id-card-cloud-platform

# Install dependencies
npm install

# Push database schema (SQLite dev.db)
npx prisma db push

# Seed default administrator, operator, and hospital staff records
node scripts/seed.js
```

### 3. Run the Development Server
```bash
npm run dev
# The application will be available at http://localhost:3000
```

### 4. Build & Run for Production
```bash
npm run build
npm run start
```

---

## 🔑 Pre-Seeded Default Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@idstudio.gov.ng` | `Admin123!@#` | Full system control, user management, staff CRUD, audit logs |
| **Card Operator** | `operator@idstudio.gov.ng` | `Operator123!@#` | Issue new cards, capture passport/signature, preview cards |

---

## 🧪 Automated End-to-End Test Suite

Run the included automated integration test suite:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-endpoints.ps1
```

All 12 automated test cases verify:
- Landing Page (HTTP 200)
- Public Verification API (`/api/verify/P6014`)
- Verification UI Portal (`/verify/P6014`)
- Administrator Authentication (`/api/auth/login`)
- Authenticated Session (`/api/auth/me`)
- Staff Directory Query & Filtering (`/api/staff`)
- Executive Analytics Aggregation (`/api/analytics`)
- CSV Export Stream (`/api/export/csv`)
- New Card Issuance (`POST /api/staff`)
- Real-time Verification of Newly Issued Card
- Security Audit Trail Query (`/api/audit-logs`)

---

## 📂 Documentation Links

- [DEPLOYMENT.md](file:///C:/Users/Olayhinka/.gemini/antigravity/scratch/id-card-cloud-platform/DEPLOYMENT.md): Detailed cloud deployment guide (Vercel, Railway, Render, Netlify, Custom Domains).
- [DATABASE_SETUP.md](file:///C:/Users/Olayhinka/.gemini/antigravity/scratch/id-card-cloud-platform/DATABASE_SETUP.md): Instructions for connecting PostgreSQL, Supabase, Neon, or AWS RDS.
- [USER_GUIDE.md](file:///C:/Users/Olayhinka/.gemini/antigravity/scratch/id-card-cloud-platform/USER_GUIDE.md): End-user operational handbook.
