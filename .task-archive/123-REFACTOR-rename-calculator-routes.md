# 123-REFACTOR: Rename Calculator Routes to Norwegian

**Priority**: Medium
**Effort**: Small (30 min)
**Labels**: frontend, routes, i18n

---

## Context

Calculator routes should use Norwegian URL slugs for consistency:
- `/kalkulatorer/compound` → `/kalkulatorer/rentes-rente`
- `/kalkulatorer/loan` → `/kalkulatorer/lan`

---

## Acceptance Criteria

- [x] Rename `/kalkulatorer/compound` to `/kalkulatorer/rentes-rente`
- [x] Rename `/kalkulatorer/loan` to `/kalkulatorer/lan`
- [x] Add redirects from old URLs to new URLs
- [x] Update all internal links to use new URLs
- [x] Update Breadcrumb labels if needed (already correct)

---

## Resolution (2025-12-04)

**Files modified**:
- `frontend/src/routes/index.tsx` - Route paths + redirects
- `frontend/src/features/calculators/CalculatorsPage.tsx` - href values
- `e2e/frontend/navigation.spec.ts` - Updated test paths
- `e2e/frontend/kalkulatorer.spec.ts` - Updated test paths

**Notes**: Breadcrumbs already had correct Norwegian labels. Legacy redirects maintain backward compatibility.

---

## Technical Approach

1. Update routes in `frontend/src/routes/index.tsx`
2. Add `<Navigate>` redirects for old paths
3. Update links in `CalculatorsPage.tsx`
4. Update any breadcrumb paths

---

## Files to Modify

- [routes/index.tsx](frontend/src/routes/index.tsx#L98-L119) - Route definitions
- [CalculatorsPage.tsx](frontend/src/features/calculators/CalculatorsPage.tsx#L13-L28) - href values
- [CompoundCalculatorPage.tsx](frontend/src/features/calculators/CompoundCalculatorPage.tsx) - Breadcrumb path
- [LoanCalculatorPage.tsx](frontend/src/features/calculators/LoanCalculatorPage.tsx) - Breadcrumb path

---

## Route Changes

```tsx
// Old
<Route path="kalkulatorer/compound" element={...} />
<Route path="kalkulatorer/loan" element={...} />

// New
<Route path="kalkulatorer/rentes-rente" element={...} />
<Route path="kalkulatorer/lan" element={...} />

// Redirects
<Route path="kalkulatorer/compound" element={<Navigate to="/kalkulatorer/rentes-rente" replace />} />
<Route path="kalkulatorer/loan" element={<Navigate to="/kalkulatorer/lan" replace />} />
```
