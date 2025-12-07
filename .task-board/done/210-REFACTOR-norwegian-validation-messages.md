# REFACTOR: Norwegian Validation Messages for Users

**Status**: Backlog
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: i18n, backend, frontend, ux
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Backend validation error messages are in English, but users see these messages in the UI. For Norwegian users, validation errors should be displayed in Norwegian. Backend logs can remain in English for developer debugging.

User feedback: "feilmeldinger til brukeren bør være på norsk. logger kan være på engelsk"

## Current State

- `backend/src/validators/schemas.ts` has English error messages
- Examples: "Nickname must be at least 3 characters", "Monthly salary cannot be negative"
- These messages are returned to frontend and displayed to users
- No i18n system in place

## Desired Outcome

Validation errors shown to users are in Norwegian. Internal logs and developer-facing errors remain in English.

## Acceptance Criteria

- [x] User-facing validation messages are in Norwegian
- [x] Backend logs remain in English for debugging
- [x] Error codes maintained for frontend to map messages if needed
- [x] All existing validation rules preserved
- [x] Lint passes
- [x] Build passes

## Affected Components

### Backend
- **File**: `backend/src/validators/schemas.ts`

### Frontend (alternative approach)
- Could add error message mapping in frontend instead

## Technical Approach

### Option A: Norwegian messages in backend schemas (Recommended)
Directly translate Zod error messages:

```typescript
export const userSetupSchema = z.object({
  nickname: z
    .string()
    .min(3, 'Kallenavn må være minst 3 tegn')
    .max(30, 'Kallenavn kan ikke være mer enn 30 tegn')
    .regex(USERNAME_REGEX, 'Kallenavn kan kun inneholde bokstaver, tall og understrek'),
  // ...
});
```

### Option B: Error code mapping in frontend
Keep English messages in backend, map to Norwegian in frontend:

```typescript
const errorMessages: Record<string, string> = {
  'Nickname must be at least 3 characters': 'Kallenavn må være minst 3 tegn',
  // ...
};
```

### Recommended: Option A
Simpler, single source of truth, no mapping needed.

### Messages to Translate

**User Setup**:
- "Nickname must be at least 3 characters" → "Kallenavn må være minst 3 tegn"
- "Nickname must be at most 30 characters" → "Kallenavn kan ikke være mer enn 30 tegn"
- "Nickname can only contain letters, numbers, and underscores" → "Kallenavn kan kun inneholde bokstaver, tall og understrek"
- "Invalid email format" → "Ugyldig e-postformat"

**Profile**:
- "Monthly salary cannot be negative" → "Månedslønn kan ikke være negativ"
- "Monthly savings cannot be negative" → "Månedlig sparing kan ikke være negativ"
- "Annual expenses cannot be negative" → "Årlige utgifter kan ikke være negative"
- "Birth year must be an integer" → "Fødselsår må være et heltall"
- "Birth year must be 1900 or later" → "Fødselsår må være 1900 eller senere"
- "Birth year cannot be in the future" → "Fødselsår kan ikke være i fremtiden"
- "Retirement age must be an integer" → "Pensjonsalder må være et heltall"
- "Retirement age must be at least 30" → "Pensjonsalder må være minst 30"
- "Retirement age cannot exceed 100" → "Pensjonsalder kan ikke være over 100"
- "F.I.R.E. number cannot be negative" → "F.I.R.E.-tall kan ikke være negativt"

**Account**:
- "Account name is required" → "Kontonavn er påkrevd"
- "Account name must be at most 100 characters" → "Kontonavn kan ikke være mer enn 100 tegn"
- "Category must be sparing, gjeld, or pensjon" → "Kategori må være sparing, gjeld eller pensjon"
- "Sort order cannot be negative" → "Sorteringsrekkefølge kan ikke være negativ"
- "Interest rate cannot be negative" → "Rente kan ikke være negativ"
- "Interest rate cannot exceed 100%" → "Rente kan ikke overstige 100%"
- "Remaining years cannot be negative" → "Gjenværende år kan ikke være negativt"
- "Remaining years cannot exceed 50" → "Gjenværende år kan ikke overstige 50"
- "Original amount must be positive" → "Opprinnelig beløp må være positivt"

**Snapshot**:
- "Date must be in dd.MM.yyyy format" → "Dato må være i formatet dd.MM.yyyy"
- "Value must be a finite number" → "Verdi må være et gyldig tall"
- "Value cannot be negative (except for gjeld)" → "Verdi kan ikke være negativ (unntatt for gjeld)"
- "Asset class is required" → "Aktivaklasse er påkrevd"
- "Snapshot ID is required" → "Øyeblikksbilde-ID er påkrevd"
- "Account ID is required" → "Konto-ID er påkrevd"
- "At least one field to update is required" → "Minst ett felt må oppdateres"

**Calculator**:
- Keep calculator error messages in English (technical, rarely seen by users)

### Dependencies
- None

### Risks & Considerations
- **Risk**: Missing translations
- **Mitigation**: Systematic review of all error messages
- **Note**: Technical messages (like "compounding frequency") can stay in English

## Related Plans
- 204-REFACTOR-schema-field-name-consistency.md (just completed)

---
**Next Steps**: Ready for implementation. Move to in-progress/ when starting.
