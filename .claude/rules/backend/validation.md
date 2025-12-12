# Validation Rules

## Stack
Zod

## Structure
- `/validators/schemas.ts` - All Zod schemas
- `/validators/*Validator.ts` - Domain-specific validators
- `/middleware/validate.ts` - Generic validation middleware

## Patterns
- Middleware: `validate(schema, target)` replaces req data with validated output
- Convenience wrappers: `validateBody(schema)`, `validateParams(schema)`, `validateQuery(schema)`
- Error response: 400 with `VALIDATION_ERROR` code, detailed field errors

## Key Schemas
- Norwegian date: `z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/)` + custom refinement
- Categories: `z.enum(['sparing', 'gjeld', 'pensjon'])`
- Asset classes: `z.enum(['aksjer', 'fond', 'krypto', 'bankkonto', 'lån', 'pensjon'])`
- Account value: negative only allowed for gjeld (use `.refine()`)

## Decisions
- Zod strips unknown fields by default (security + cleaner data)
- All input validated before hitting service layer
- Business validation (uniqueness, ownership) in services, not middleware

## Gotchas
- Query params are strings - must `.transform()` to number/boolean
- Zod `.parse()` throws, use `.safeParse()` in middleware
- If frontend sends extra fields, add to schema or they're silently dropped
- Date validation: regex + actual date parsing (invalid dates like 99.99.2024 rejected)
