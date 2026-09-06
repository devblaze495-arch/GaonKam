# Job lifecycle

The job lifecycle should remain configurable and extensible.

## Initial lifecycle progression

```text
DRAFT
  -> OPEN
  -> APPLICATIONS_RECEIVED
  -> WORKERS_SELECTED
  -> IN_PROGRESS
  -> COMPLETION_PENDING
  -> COMPLETED
```

## Possible additional states

- CANCELLED
- EXPIRED
- DISPUTED

## Business rules to enforce later

- A completed job cannot accept new applicants.
- An expired job cannot accept applications.
- A user cannot apply to their own job.
- A user cannot apply to the same job more than once.
- Only authorized workers can be selected for a job.
- Completion requires review and confirmation from relevant participants.

## Scheduled processing

The architecture should support tasks that evaluate whether a job deadline or application window has elapsed and update status to `EXPIRED` when required.
