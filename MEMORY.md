# Project Memory

## Current State
* The Minimum Viable Product (MVP) is officially complete. The frontend Dashboard successfully executes secure CRUD operations against the FastAPI backend, utilizing JWTs for stateless tenant isolation.
* Phase 1 (Database & Data Modeling) is complete.
* Phase 2 (Core Authentication) is complete.
* Phase 3 (Secure Data Isolation) is complete.
* Successfully enforced database-level tenant isolation.
* Skipping OAuth for now; Phase 4 moved to backlog.
* Phase 5 (Frontend & Networking) is complete.
* Phase 6 (The Task Dashboard) is complete.

## Architectural Decisions
* **Decision 1**: Strict Data Isolation. All CRUD operations must take `current_user.id` as a required parameter to prevent Cross-Tenant Data Leaks.
* **Decision 2**: Database out approach. We will not build API routes until the database models and Alembic migrations are solid.
* **Decision 3**: Use SQLAlchemy 2.0 style queries (e.g., `select()`, `session.scalars()`).
* **Decision 4**: Pinned bcrypt to version 4.0.1 to resolve passlib internal testing bug and maintain secure hashing pipeline.
* **Decision 5**: Tenant isolation is enforced strictly at the database CRUD layer (`user_id` filtering), not just the API route level, to prevent IDOR vulnerabilities.

## Known Issues / Blockers
* None yet. Pending database environment setup.

## Next Action
* Refactoring, writing unit tests (pytest/vitest), or pulling "Advanced Identity Management (OAuth)" from the backlog.