# Repair Tracker

A full-stack device repair and ticket management application built over 30 days to master **React**, **NestJS**, and **PostgreSQL** fundamentals.

## Tech Stack
* **Frontend:** React, Vite, TypeScript
* **Backend:** NestJS, TypeScript
* **Database:** PostgreSQL (Docker)

## Project Structure
```text
repair-tracker/
├── client/               # React + Vite frontend
├── server/               # NestJS REST API backend
├── docker-compose.yml    # Local PostgreSQL container setup
└── README.md
```

## Local Setup

1. **Start the PostgreSQL database:**
   ```bash
   docker compose up -d
   ```

2. **Run the Backend (`/server`):**
   ```bash
   cd server
   pnpm install
   pnpm run start:dev
   ```

3. **Run the Frontend (`/client`):**
   ```bash
   cd client
   pnpm install
   pnpm run dev
   ```

---
