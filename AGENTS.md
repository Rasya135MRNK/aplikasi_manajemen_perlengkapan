# AGENTS.md

## Project structure
- **monorepo**: `backend/` (Node.js/Express) + `frontend/` (React/Vite)
- **entrypoints**: `backend/src/index.js` | `frontend/src/main.jsx`
- **DB**: MySQL 8 via Sequelize ORM, **auto-syncs on startup** (`sync({alter:true})`) — no migration files

## Key commands

| Where | Command | Purpose |
|-------|---------|---------|
| `/backend` | `npm start` | Production (node) |
| `/backend` | `npm run dev` | Dev with nodemon |
| `/frontend` | `npm run dev` | Vite dev server (port 5173) |
| `/frontend` | `npm run build` | Production build to `dist/` |

**No test, lint, or typecheck scripts exist.**

## Dev workflow (without Docker)
1. Start MySQL on port 3306
2. `cp .env.example .env` — change `MYSQL_HOST` to `localhost`
3. `cd backend && npm run dev`
4. `cd frontend && npm run dev` — proxies `/api` and `/uploads` to `localhost:5000`

## Architecture notes
- **Auth**: `Bearer <JWT>` header → `auth.js` finds user by `decoded.id` → sets `req.user`
- **Roles**: semua user adalah `staff` dengan akses penuh (role system dihapus)
- **Image upload**: Multer → `backend/uploads/items/`, max 2MB, only JPG/PNG/WEBP, required on create
- **Serving uploads**: Express `static('/uploads')` on dev, Nginx proxy on Docker
- **WhatsApp (Waha)**: sends to `admin.phone` (users table) via REST `POST /api/sendText` with `X-API-Key`
- **Notification scheduler**: starts on server boot, runs every 30 min, checks low stock + overdue loans. Deduplicates by checking last 24h
- **Vite proxy**: dev server proxies `/api/*` and `/uploads/*` to backend at `localhost:5000`

## Frontend routing (React Router v6)
```
/login  (public)
/       → Layout (sidebar + navbar) wraps all authenticated routes:
  /, /items, /items/add, /items/:id/edit, /categories,
  /checkin, /checkout, /transactions, /loans, /loans/add,
  /notifications, /reports
  /users
```

## Docker Compose
- MySQL on **3307** (not 3306), with `healthcheck`
- Waha on **3002** — **must scan QR code** at `http://localhost:3002` on first run
- Backend on **5000**
- Frontend (Nginx) on **80**

## State management
- **Zustand** store `authStore`: persists `token` and `user` to localStorage
- Axios interceptor auto-attaches `Bearer` token and redirects to `/login` on 401

## Gotchas
- `.env` is gitignored; always `cp .env.example .env` before running
- Uploads are stored inside the container by default — use Docker volume `uploads_data` for persistence
- User passwords are hashed via Sequelize `beforeCreate` hook (bcryptjs, salt rounds 10)
- No seed data — first user must be created manually via DB or API
- `fetch()` in `waha.js` uses native Node.js fetch (available from Node 18+)
