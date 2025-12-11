# Material Inventory API

Multi-tenant Material Inventory API built using Node.js, Express, Prisma, and SQLite/PostgreSQL. Includes tenant isolation, RBAC, FREE vs PRO plan rules, inventory tracking, soft deletes, and analytics.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Update DATABASE_URL inside .env if needed
```

### 3. Generate Prisma client
```bash
npm run prisma:generate
```

### 4. Run migrations
```bash
npm run prisma:migrate
```

### 5. Start the server
```bash
npm run dev
```

API runs at: http://localhost:3000

## Multi-Tenant Architecture

This system follows a shared-database, shared-schema multi-tenant architecture where every tenant-owned record includes a tenantId for strict row-level isolation. Tenant and user context is loaded through middleware, ensuring that all database queries are automatically scoped to the requesting tenant. RBAC enforces permission boundaries so only admins can manage materials while both admins and users can record transactions. Business rules differ by plan type (FREE vs PRO), including limits on materials and PRO-only analytics. Soft deletes provide safe data retention without exposing deleted records in normal queries. This design keeps the system scalable, secure, and easy to extend.

## API Overview

### Core Endpoints

- `POST /tenants` - Create a new tenant
- `POST /users` - Create a user (admin only)
- `POST /materials` - Create material (admin only)
- `GET /materials` - List materials
- `GET /materials/:id` - Get material with transactions
- `DELETE /materials/:id` - Soft delete material (admin only)
- `POST /materials/:id/transactions` - Record stock transaction
- `GET /analytics/summary` - Get analytics (PRO plan only)

## Tech Stack

- Node.js 18+
- TypeScript (strict mode)
- Express.js
- Prisma ORM
- SQLite / PostgreSQL
- Zod validation

## License

MIT
