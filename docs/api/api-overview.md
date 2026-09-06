# API overview

The backend exposes application endpoints under the `/api` namespace.

## Initial endpoint

- `GET /api/health` returns service health information

## Planned API areas

- Auth
- Users
- Jobs
- Applications
- Services
- Ratings
- Admin
- Disputes

## API conventions

- JSON responses
- Consistent error envelopes
- Validation at controller or service boundaries
- Clear separation between route definitions and business logic
- Environment-driven configuration for secrets and database access

## Future standards

- Pagination for list endpoints
- Filtering and sorting for jobs and services
- Rate limits for public-facing endpoints
- Centralized error handling and request validation
