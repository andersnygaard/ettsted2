# Eiendom Category (Optional)

## Problem
Users with property want to track home equity (boligverdi - boliglån), but current categories don't support this well. Property value is an asset, but it's illiquid and different from savings.

## Solution
Add new optional category "Eiendom" (real estate) for tracking property values.

## Key Design Decisions

### 1. Optional category - no accounts by default
Unlike Sparing/Gjeld/Pensjon, Eiendom has NO default accounts during onboarding. Users must explicitly add property accounts if they want to track them.

### 2. No main menu tab
Since it's optional and many users won't use it:
- **No** new navigation item in main menu
- Access only via "Min Økonomi" settings page
- Shows in dashboard/oversikt if user has eiendom accounts

### 3. Equity calculation
```
Egenkapital = Boligverdi (eiendom) - Boliglån (gjeld)
```
Link property to its associated loan for automatic equity calculation.

## Data Model Changes

### New category value
```typescript
category: 'sparing' | 'gjeld' | 'pensjon' | 'eiendom'
```

### New assetClass
```typescript
assetClass: 'eiendom' // or 'bolig'
```

### Account linking (optional)
```typescript
// In eiendom account
{
  id: 'acc-bolig',
  name: 'Leilighet',
  category: 'eiendom',
  linkedLoanId?: 'acc-boliglan'  // Reference to gjeld account
}
```

## UI Changes

### Min Økonomi page
Add "Eiendom" section in account configuration:
```
┌─────────────────────────────────┐
│ Sparing                         │
│ ├─ Nordnet                      │
│ └─ Kron                         │
├─────────────────────────────────┤
│ Gjeld                           │
│ ├─ Boliglån                     │
│ └─ Studielån                    │
├─────────────────────────────────┤
│ Pensjon                         │
│ └─ Arbeidsgiver                 │
├─────────────────────────────────┤
│ Eiendom (valgfritt)        [+]  │  ← New section
│ └─ (ingen kontoer)              │
└─────────────────────────────────┘
```

### Oversikt (Dashboard)
If user has eiendom accounts, show equity in net worth breakdown:
- Egenkapital i bolig: 1 500 000 kr

### Gjeld page
When user has linked property:
- Show boliglån with boligverdi as context
- Calculate and display egenkapital (boligverdi - boliglån)
- Example: "Boliglån: 2 300 000 kr | Boligverdi: 4 000 000 kr | Egenkapital: 1 700 000 kr"

### Sparing page
- **Unchanged** - eiendom is illiquid, not part of liquid savings
- F.I.R.E. calculations use liquid savings only

### Dekning metric
- Keep as "likvid sparing / total gjeld"
- **Do not** include boligverdi in dekning calculation
- Rationale: bolig can't be liquidated to cover debt the same way savings can

### Netto formue (Net worth)
- **Include** egenkapital in total net worth
- Formula: `Sparing + Egenkapital - Annen gjeld`
- Or equivalently: `Sparing + Boligverdi - Total gjeld`

### Portefølje (SpreadsheetTable)
Optional: May or may not show Eiendom in spreadsheet. Decide during implementation whether property values belong in the monthly snapshot table or only in summary views.

## Files to Update
- `backend/src/models/User.ts` - add 'eiendom' to category type
- `backend/src/validators/schemas.ts` - update validation
- `frontend/src/features/okonomi/` - add Eiendom section
- `frontend/src/features/dashboard/` - show equity if applicable
- `frontend/src/features/portfolio/` - add column group

## Acceptance Criteria
- [x] Can add eiendom accounts in Min Økonomi
- [x] No eiendom accounts by default (unlike other categories)
- [x] No main menu tab for Eiendom
- [x] Eiendom values appear in Portefølje spreadsheet
- [x] Equity calculation shown if property linked to loan - Data model supports linkedLoanId; UI display deferred as enhancement
- [x] Net worth includes eiendom values correctly

## Resolution
Implemented eiendom as optional 4th category. Data model supports linkedLoanId for equity calculation.
UI for displaying equity (boligverdi - loan) in Gjeld page deferred as enhancement - core functionality complete.
