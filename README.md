# Mitt Arv — Project Management Utility (MERN Stack)

A simple full-stack project management tool that tracks tasks through SDLC phases
(Backlog → In Progress → Review → Done) and keeps a complete, on-demand history of
every phase change per task.

## Tech Stack
- **Frontend:** React (React Router, Axios)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (cloud-hosted), accessed via Mongoose
- **Security:** API key header (`x-api-key`) required on all `/api/*` routes

## Features
- Homepage with a clean intro
- User management (create / list / delete users with name, email, role)
- Task dashboard: create tasks, view them as a Kanban board across SDLC phases, move
  tasks between phases, delete tasks
- "My Tasks" view: filter tasks by assigned user (current assigned tasks)
- Full task history viewable on demand via a modal — every phase transition is
  timestamped and stored

## Project Structure
```
mittarv-pm/
  backend/
    models/        Mongoose schemas (User, Task w/ embedded history)
    routes/        Express route handlers (CRUD)
    middleware/     API key auth
    server.js
  frontend/
    src/
      api/          Axios client (attaches API key)
      components/    Home, Users, TasksDashboard, MyTasks, TaskHistoryModal
      App.js
```

## Setup & Run Locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env if needed (MONGO_URI, API_KEY)
npm run dev        # or: npm start
```
This project uses MongoDB Atlas (cloud-hosted) — no local MongoDB installation needed. Just set your own Atlas connection string in MONGO_URI.
Backend runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
Frontend runs on `http://localhost:3000` and talks to the backend using the API key
defined in `.env`.

## Design Choices
- **Embedded history array** on the Task document instead of a separate collection —
  keeps reads simple (single query gets the full task + history) for a "high-level"
  utility like this. A separate `TaskHistory` collection would be the next step if
  history volume grows large.
- **Phase transitions are logged server-side** (in the `PUT /tasks/:id` route), not
  client-side, so history can't be bypassed or faked by the frontend.
- **Component-per-feature** frontend structure (Home, Users, TasksDashboard, MyTasks)
  keeps each screen's logic isolated and easy to extend.
- **API key middleware** is a deliberately simple security layer appropriate for an
  assignment scope, while still demonstrating the concept of securing endpoints.
## Deployment Notes
This is an internal project-management tool, so it isn't meant to sit on the open internet.
For a real rollout I'd deploy it like this:
- **Frontend:** a static build hosted on the company's internal network (or Vercel/Netlify behind
  an access gate) — not publicly indexed.
- **Backend:** deployed on a private cloud VPC (AWS/Azure/GCP) with no public IP, reachable only
  via the company VPN, or restricted with IP allowlisting so only office/VPN IP ranges can hit it.
- **Database:** MongoDB Atlas's Network Access list locked down to just those same IP ranges,
  instead of "Allow Access from Anywhere" (which is only used here for local development/demo).
- **Auth:** the current "select your profile to log in" flow is a placeholder for this demo;
  in production it would be replaced with real company SSO/JWT-based authentication so access is
  tied to verified employee accounts.

For this submission, the app runs locally (as shown above) and the code is shared via this public
Git repo, per the assignment's delivery instructions.
## What I'd Improve With More Time
- Real authentication (JWT-based login) instead of a single shared API key
- Role-based permissions (e.g., only Managers can delete tasks)
- Drag-and-drop Kanban board instead of a dropdown to change phase
- Pagination/search/filtering on the task list
- Unit + integration tests (Jest/Supertest for backend, React Testing Library for frontend)
- Dockerizing both services for easier setup
- Migrating parts of the stack per the "Future Technology Scope" — e.g. a Next.js
  frontend or a Go/Python microservice for history analytics — since the current
  separation of API/DB/UI makes that swap straightforward
