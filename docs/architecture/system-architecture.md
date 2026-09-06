# System architecture

GaavKaam is designed as a modular two-part application with a clear separation between the frontend and the backend.

## High-level architecture

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + TypeScript + Express.js
- Database: PostgreSQL with Prisma ORM
- Shared conventions: typed APIs, environment-driven configuration, structured folders, and a single source of truth for business rules

## Separation of concerns

The frontend handles:

- Routing
- UI and user flows
- Forms and validation display
- Language switching
- API calls to the backend

The backend handles:

- User and job business logic
- Database access
- Authentication and authorization
- Validation and error handling
- State transitions and trust updates

## Design principles

- No employer/worker split in the data model; every user is a single `User` entity.
- Jobs, services, applications, ratings, and trust records should be domain-driven and reusable.
- Modules should remain small and independent.
- Extensible lifecycle states for jobs and disputes should be supported.
- Future admin flows and review workflows should be added without major architectural changes.

## Future extension points

- Cron jobs or scheduled tasks for job expiration
- Prisma models for ratings, applications, disputes, and audit logs
- Admin role and permission layer
- Multilingual translation resources
- Service and category management tables
