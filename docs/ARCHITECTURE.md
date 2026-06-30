# System Architecture

## Overview
A lightweight, multi-tenant web application for secure personal task management. The system guarantees that users can only access their own data through strict authorization dependencies and database-level filtering.

## Backend (FastAPI)
The backend follows a service-oriented structure:
* **API Layer (`app/api/`)**: Defines HTTP routes and applies security dependencies.
* **Core (`app/core/`)**: Manages configuration, JWT generation, and hashing.
* **CRUD (`app/crud/`)**: Houses all SQLAlchemy queries, explicitly enforcing the `user_id == current_user.id` rule.
* **Models (`app/models/`)**: Defines the relational structure (Users, Tasks).
* **Schemas (`app/schemas/`)**: Pydantic models for request validation and response formatting.

## Frontend (React + Vite)
A Single Page Application (SPA) communicating with the backend via REST:
* **API Wrapper (`src/api/`)**: Centralized Axios configuration to handle base URLs and Auth headers.
* **Context (`src/context/`)**: Manages the user session and token state.
* **Routing (`src/routes/`)**: Guards private pages from unauthenticated access.

## Data Model
* **User**: `id` (PK), `email` (Unique), `hashed_password`, `google_oauth_id`, `created_at`.
* **Task**: `id` (PK), `title`, `is_completed`, `user_id` (FK -> User.id), `created_at`.

## Authentication Flow
1. Client submits credentials or Google OAuth token.
2. Backend validates and issues a short-lived JWT.
3. Client stores JWT and attaches it to the `Authorization: Bearer <token>` header for subsequent requests.
4. FastAPI `get_current_user` dependency intercepts the request, decodes the JWT, and provides the `User` object to the route.