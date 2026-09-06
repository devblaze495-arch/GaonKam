# Database design

The database foundation uses PostgreSQL with Prisma as the ORM.

## Core idea

Every user is represented by a single `User` model. Users can create jobs, apply to jobs, offer services, and review other users after completed work.

## Planned domain models

- User
- Job
- JobApplication
- Service
- Rating
- TrustScore
- Dispute
- AdminAction
- AuditLog

## Important design considerations

- A user should be able to act as an employer and a worker across different jobs.
- Job lifecycle states should be stored as a controlled enum.
- Application uniqueness rules should prevent duplicate applications.
- Ratings should reference the related job and both users involved.
- Trust scores should be driven by outcomes and reviewable by admins.
- Service categories should be extensible without redesigning the schema.

## Prisma foundation

The project is prepared to use Prisma for migrations and schema management. Actual schema generation will be added when the core data model is ready.
