# The "Secure-By-Default" Task Manager

A lightweight, multi-tenant web application demonstrating strict database-level data isolation,
stateless authentication, and modern API design. This repository is an opinionated reference
implementation showing how to guarantee that users can never read or modify data that does not
belong to them — enforcement is performed at the database/query layer.

For architecture diagrams and a deeper rationale, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Stack (summary)**
- Backend: Python 3.10+, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2, Passlib, python-jose
- Frontend: React 18, Vite, React Router, Axios
- Database: SQLite (development) — PostgreSQL ready
- Auth: JWT (HS256) with bcrypt (via Passlib; tested against bcrypt v4.0.1)

## 🚀 Quick Start

Follow these steps to run the app locally for development. The project uses SQLite by default; switch
to PostgreSQL in production by setting `DATABASE_URL`.

### 1) Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with at least:

```ini
# Cryptographic secret used to sign JWTs (replace in production)
SECRET_KEY="your-super-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# SQLite development DB
DATABASE_URL="sqlite:///./sql_app.db"
```

Run migrations and start the server:

```bash
cd backend
alembic upgrade head
uvicorn app.main:app --reload
```

Open API docs: http://localhost:8000/docs

### 2) Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open the app: http://localhost:5173

## 🔒 Security Highlights

- **Database-Level Tenant Isolation:** All read/write queries are scoped by `user_id` at the SQLAlchemy layer. This design prevents Insecure Direct Object References (IDORs) by construction.

- **Stateless Authentication:** The backend issues JWTs. The frontend attaches tokens to requests via an Axios interceptor. For production, prefer `httpOnly` cookies to mitigate XSS.

- **Fail-Secure Configuration:** The app uses Pydantic settings and is configured to fail on missing cryptographic secrets — avoiding insecure defaults.

- **Validation & Defense-in-Depth:** Pydantic models validate input; dependency-based route auth plus query scoping enforce authorization at multiple layers.

## ⚙️ Production Notes

- Use a secrets manager for `SECRET_KEY` and rotate keys periodically.
- Switch to PostgreSQL for production (`DATABASE_URL`), and ensure Alembic migrations are applied during deployment.
- Serve the API behind HTTPS and configure cookie/session security flags if switching to cookies.
- Add observability: audit logs for auth events and failed access attempts, alerting for suspicious behavior.

## 🧪 Testing & CI

- Backend: add `pytest` tests for unit and integration scenarios, including tenant isolation tests.
- Frontend: add `vitest` + `@testing-library/react` for component and integration tests.

## Contributing

1. Open an issue describing your change or feature.
2. Follow the repo patterns: business logic in `services/`, DB access in `crud/`, routers in `api/`.
3. Run tests and linters before submitting a PR.


