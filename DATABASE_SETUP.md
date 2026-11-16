# Database Architecture & Configuration Guide

**ID Studio Cloud** uses **Prisma ORM** as its data access layer. It ships pre-configured with **SQLite** for instant zero-dependency local development and is fully architected to transition to **PostgreSQL**, **Supabase**, or **Neon** for production cloud deployments.

---

## 1. Current Local Database: SQLite (Zero Setup)

The repository includes a persistent SQLite database located at `./prisma/dev.db`.
- **Connection String in `.env`:**
  ```env
  DATABASE_URL="file:./dev.db"
  ```
- **Schema Provider in `prisma/schema.prisma`:**
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
  }
  ```

---

## 2. Switching to PostgreSQL / Supabase for Production

To connect to a managed cloud database such as **Supabase** or **Neon**:

### Step 1: Update Schema Provider
In `prisma/schema.prisma`, change line 2 from `sqlite` to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Set the Production Connection String
In your production environment or `.env.production` file:
```env
# For Supabase (Transaction Pooler):
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# For Neon Serverless Postgres:
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/idstudio?sslmode=require"
```

### Step 3: Push Schema to the Cloud Database
Run the schema sync command:
```bash
npx prisma db push
```

### Step 4: Seed Default Users and Hospital Records
Run the automated seed script to populate the database with default accounts and sample hospital records:
```bash
node scripts/seed.js
```

---

## 3. Database Schema Overview

```
 ┌───────────────┐         ┌──────────────────┐
 │     User      │         │   StaffMember    │
 ├───────────────┤         ├──────────────────┤
 │ id (PK)       │         │ id (PK)          │
 │ email (UQ)    │         │ staffId (UQ)     │
 │ password      │         │ fullName         │
 │ role          │         │ designation      │
 │ name          │         │ department       │
 └───────┬───────┘         │ bloodGroup       │
         │ 1               │ issueDate        │
         │                 │ expiryDate       │
         │ *               │ status           │
 ┌───────┴───────┐         │ photoUrl         │
 │   AuditLog    │ *     1 │ signatureUrl     │
 ├───────────────┼─────────┤ qrVerificationCd │
 │ id (PK)       │         └──────────────────┘
 │ action        │
 │ details       │
 │ ipAddress     │
 │ createdAt     │
 └───────────────┘
```

- **`User`**: System operators, viewers, and administrators with hashed credentials and role permissions.
- **`StaffMember`**: Hospital personnel identity records with biometric photo URLs, digital signature data, validity dates, department allocations, and unique QR verification tokens.
- **`AuditLog`**: Security audit entries recording all logins, card issuances, modifications, deletions, and verification scans.
- **`TemplateConfig`**: Master layout configurations for card dimensions, color palettes, and component placements.
