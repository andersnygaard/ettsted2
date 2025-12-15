# FEATURE: Import agent - bedre bekreftelsesmelding

**Status**: Done
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: backend, import-agent, ux
**Estimated Effort**: Simple - 30 minutes
**Skill:** node-backend

## Context & Motivation

Import-agentens bekreftelsesmelding mangler viktig info og har dårlig formatering:

**Nåværende respons (dårlig):**
```
Jeg fant følgende i dataene dine:
📅 Datoer: 01.12.2025 til 01.12.2025 (1 måned)
📊 Kontoer: Kron

Vil du importere alle disse?
```

Problemer:
1. **Beløp mangler** - brukeren kan ikke verifisere at verdien ble forstått riktig
2. **Dato-range for én dato** - "01.12.2025 til 01.12.2025" ser dumt ut

## Desired Outcome

**Én dato, én konto:**
```
Jeg fant følgende i dataene dine:
📅 Dato: 01.12.2025
💰 Kron: 1 000 kr

Vil du importere dette?
```

**Flere datoer, flere kontoer:**
```
Jeg fant følgende i dataene dine:
📅 Datoer: 01.11.2025 til 01.12.2025 (2 måneder)
💰 Nordnet: 150 000 kr, 155 000 kr
💰 Kron: 1 000 kr, 1 200 kr

Vil du importere alle disse?
```

## Acceptance Criteria

- [x] Beløp vises i bekreftelsesmeldingen
- [x] Én dato vises som "Dato: X", ikke "Datoer: X til X"
- [x] Flere datoer vises som range med antall måneder
- [x] Norsk tallformatering (mellomrom som tusenskilletegn)

## Affected Components

### Backend
- **File**: `backend/src/services/importAgentService.ts`
- **Lines**: 94-99 (system prompt template)

## Technical Approach

Oppdater system prompt-templaten fra:

```
"Jeg fant følgende i dataene dine:
 📅 Datoer: [first] til [last] ([count] måneder)
 📊 Kontoer: [list account names found with matching results]

 Vil du importere alle disse?"
```

Til noe som:

```
"Jeg fant følgende i dataene dine:
 📅 Dato: [date] (hvis én) ELLER Datoer: [first] til [last] ([count] måneder) (hvis flere)
 💰 [Kontonavn]: [beløp formatert] (for hver konto)

 Vil du importere dette/alle disse?"
```

Merk: Dette er en prompt-endring. LLM-en genererer faktisk tekst, så prompten instruerer den om *hvordan* den skal formatere output - ikke en hardkodet template.

## Code References

### Current prompt (lines 94-99)

```typescript
- Present a summary to the user in Norwegian:
  "Jeg fant følgende i dataene dine:
   📅 Datoer: [first] til [last] ([count] måneder)
   📊 Kontoer: [list account names found with matching results]

   Vil du importere alle disse? Skriv 'ja' for å fortsette, eller fortell meg hvilke kontoer du vil ha med."
```

## Verification

Test med:
1. Én dato, én konto, ett beløp → riktig singularis
2. Flere datoer, flere kontoer → riktig range og liste
3. Beløp formateres med norsk format

---

## Resolution

Updated system prompt in `importAgentService.ts` (lines 94-117) with:
- Explicit format examples for single vs. multiple date scenarios
- 💰 emoji for account amounts (replacing 📊)
- Norwegian number formatting instructions (spaces for thousands)
- Singular/plural handling for "Dato/Datoer" and "dette/alle disse"
- Critical formatting rules section for LLM guidance

**Completed**: 2025-12-14
