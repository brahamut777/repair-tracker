\# Repair Tracker



A full-stack device repair and ticket management application built over 30 days to master \*\*React\*\*, \*\*NestJS\*\*, and \*\*PostgreSQL\*\* fundamentals.



\## Tech Stack

\* \*\*Frontend:\*\* React, Vite, TypeScript

\* \*\*Backend:\*\* NestJS, TypeScript

\* \*\*Database:\*\* PostgreSQL (Docker)



\## Project Structure

```text

repair-tracker/

├── client/               # React + Vite frontend

├── server/               # NestJS REST API backend

├── docker-compose.yml    # Local PostgreSQL container setup

└── README.md



Local Setup



Start the PostgreSQL database:



docker compose up -d



Run the Backend (/server):



cd server

pnpm install

pnpm run start:dev



Run the Frontend (/client):



cd client

pnpm install

pnpm run dev

