# GaavKaam (गावकाम)

GaavKaam is a rural workforce and local services platform designed for villages and nearby towns in Maharashtra. It connects people who need work, people who need workers, and local service providers with the people who need them, without creating separate employer and worker account types.

## Problem being solved

Rural communities often rely on informal networks to find workers, local tradespeople, and transportation support. These networks can be fragmented, slow, and difficult to scale. GaavKaam aims to make local hiring, service requests, and job visibility more structured, transparent, and trustworthy.

## Main features

- Job and work requirement posting
- Worker applications and selection
- Service listing and requests
- Rural job and local service matching
- Vehicle/transport needs associated with jobs or services
- User ratings and trust tracking
- Future dispute and admin review workflows
- Multilingual interface with Marathi, Hindi, and English support

## Tech stack

### Frontend
- React
- Vite
- TypeScript
- React Router
- Tailwind CSS

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM

## Repository structure

```text
gaavkaam/
├── frontend/
├── backend/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── workflows/
├── .gitignore
├── README.md
├── LICENSE
└── .env.example
```

## Local setup

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Prisma client support via local environment

### Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### Environment variables

Copy the example environment file and adjust values:

```bash
cp .env.example .env
```

### Start the backend

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd frontend
npm run dev
```

## Development commands

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

### Backend

```bash
cd backend
npm run dev
npm run build
npm run start
```

## Git workflow

- Main branch is the stable branch.
- Create feature branches for work such as `feature/authentication`, `feature/job-management`, or `feature/frontend-foundation`.
- Keep commits small and meaningful.
- Do not work on another developer's feature branch.

## Contribution guidelines

- Keep frontend and backend separated.
- Prefer reusable services, components, and utilities.
- Use TypeScript interfaces and typed data models.
- Keep business logic out of route handlers.
- Avoid committing secrets or credentials.
- Follow the documented architecture and directory structure.

## Current milestone

This repository is currently at the foundation stage. It establishes the initial project structure, core documentation, frontend foundation, backend baseline, environment configuration, and health-check endpoint.
