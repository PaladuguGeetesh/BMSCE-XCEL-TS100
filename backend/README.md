# Smart Expense Tracker — Express Backend

A Node.js + Express REST API with PostgreSQL (via Supabase) for the Smart Expense Tracker app.

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT auth (verifies Supabase tokens)
│   ├── routes/
│   │   ├── expenses.js        # Expense route definitions
│   │   └── budget.js          # Budget route definitions
│   ├── controllers/
│   │   ├── expensesController.js  # Expense business logic
│   │   └── budgetController.js    # Budget business logic
│   └── server.js              # App entry point
├── sql/
│   └── schema.sql             # Full DB schema for reference
├── .env.example               # Environment variable template
├── package.json
└── README.md
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Check if server is running (no auth needed) |
| GET | `/api/expenses` | Get all expenses for the logged-in user |
| POST | `/api/expenses` | Add a new expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/expenses/summary` | Get analytics (totals, categories) |
| GET | `/api/budget` | Get current month's budget |
| POST | `/api/budget` | Set/update current month's budget |
| PUT | `/api/budget/:id` | Update a budget by ID |
| GET | `/api/budget/summary` | Get budget + spent + remaining balance |

---

## Setup Instructions

### Step 1 — Get your Supabase credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **Settings → Database**
   - Copy the **URI** connection string → you'll use this as `DB_URL`
   - It looks like: `postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres`
4. Go to **Settings → API**
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **service_role** (Secret) key → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ The service_role key is secret — never put it in your frontend!

### Step 2 — Create your `.env` file

```bash
# In the backend/ folder:
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
PORT=5000
DB_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
FRONTEND_URL=http://localhost:8080
```

### Step 3 — Install dependencies

```bash
cd backend
npm install
```

### Step 4 — Start the server

```bash
# Development (auto-restarts when you save files)
npm run dev

# Production
npm start
```

You should see:
```
✅ Connected to PostgreSQL (Supabase)
🚀 Server running at http://localhost:5000
📋 Health check: http://localhost:5000/health
```

### Step 5 — Run the frontend

In a **separate terminal**:

```bash
cd smart-spend-tracker-main
npm install
npm run dev
```

The frontend runs at `http://localhost:8080` and talks to the backend at `http://localhost:5000`.

---

## How It Works

```
React Frontend
     │
     │  (1) User logs in via Supabase Auth
     │  (2) Supabase gives back a JWT token
     │
     ▼
Express Backend (port 5000)
     │
     │  (3) Frontend sends requests with:
     │      Authorization: Bearer <jwt_token>
     │
     ▼
Auth Middleware
     │
     │  (4) Verifies token with Supabase Admin client
     │  (5) Attaches user.id to req.user
     │
     ▼
Route Handler (expenses / budget)
     │
     │  (6) Queries PostgreSQL directly using user.id
     │      (no one can see other users' data)
     │
     ▼
PostgreSQL (Supabase)
```

---

## Testing the API

Once the server is running, you can test it with curl:

```bash
# Health check (no auth needed)
curl http://localhost:5000/health

# Get expenses (replace TOKEN with a real Supabase JWT)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/expenses

# Add an expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","amount":250,"category":"Food","date":"2026-03-06"}'

# Get budget summary
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/budget/summary
```

To get a TOKEN for testing:
1. Open your React app in the browser
2. Open DevTools → Console
3. Run: `(await (await import('/src/integrations/supabase/client.js')).supabase.auth.getSession()).data.session.access_token`

---

## Common Errors

| Error | Solution |
|-------|----------|
| `Database connection failed` | Check your `DB_URL` in `.env`. Make sure the password is correct. |
| `401 Unauthorized` | The JWT token is missing or expired. Log in again in the frontend. |
| `CORS error` | Make sure `FRONTEND_URL` in `.env` matches where your React app runs. |
| `Cannot find module` | Run `npm install` in the backend folder. |
| `EADDRINUSE: port 5000` | Something else is using port 5000. Change `PORT=5001` in `.env`. |
