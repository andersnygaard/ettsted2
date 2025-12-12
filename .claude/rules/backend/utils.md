# Utils Rules

## Stack
Pure TypeScript, date-fns, Winston

## Structure
- `/utils/dateUtils.ts` - Date parsing and sorting
- `/utils/tokenUtils.ts` - Demo token HMAC verification
- `/utils/cosmosHelpers.ts` - CosmosDB error handling
- `/utils/logger.ts` - Winston structured logger
- `/utils/loggerContext.ts` - Request context for logging

## Date Utils (CRITICAL)
```typescript
// Parse "dd.MM.yyyy" → Date
parseDate(dateString: string): Date

// Sort functions for snapshot arrays
compareDatesAsc(a, b): number   // oldest first
compareDatesDesc(a, b): number  // newest first
```

## Patterns
- Logger uses structured format: `logger.info('message', { context })`
- All dates in dd.MM.yyyy format (Norwegian standard)
- Token verification uses timing-safe comparison

## Decisions
- Winston for structured logging (JSON in production)
- date-fns with Norwegian locale (nb)
- No moment.js (deprecated, large bundle)

## Gotchas
- CosmosDB string sort on "dd.MM.yyyy" is ALPHABETICAL not CHRONOLOGICAL
- ALWAYS sort dates in JS after fetching: `snapshots.sort(compareDatesAsc)`
- parseDate returns Invalid Date for malformed strings - always validate first
- Logger context cleared after each request (avoid memory leaks)
