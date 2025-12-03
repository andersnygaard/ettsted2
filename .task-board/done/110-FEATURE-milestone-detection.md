# 110 - Feature: Milestone Detection in Portfolio Table

**Type**: FEATURE
**Priority**: Medium
**Effort**: Medium (3-4 hours)
**Labels**: frontend, backend, portfolio, ux

---

## Context

The SpreadsheetTable component supports milestone highlighting via the `milestones` prop, but this feature is not wired up. Portfolio page should highlight cells with gold styling when values cross threshold milestones.

**From CLAUDE.md**:
> "Gold milestone highlights (★) for threshold crossings"

**Current state**: SpreadsheetTable has `milestones` prop but PortfolioPage passes empty object.

---

## Acceptance Criteria

- [x] Milestone thresholds detected for each account
- [x] First crossing of threshold highlighted with gold styling
- [x] Thresholds: 10k increments to 100k, then 100k increments to 1M, then 1M increments
- [x] Milestone data passed to SpreadsheetTable component
- [x] Visual indicator (gold background or star) visible in table cells

---

## Technical Approach

### Option A: Frontend Calculation (Recommended)

Calculate milestones in `usePortfolioData.ts` by comparing consecutive snapshots:

```typescript
function detectMilestones(snapshots: Snapshot[]): Record<string, number[]> {
  const milestones: Record<string, number[]> = {};
  const thresholds = [
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
    100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
    1000000, 2000000, 3000000, 4000000, 5000000
  ];

  // Sort by date ascending
  const sorted = [...snapshots].sort((a, b) =>
    parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    // Check each account
    current.accounts.forEach(acc => {
      const prevAcc = previous.accounts.find(a => a.name === acc.name);
      const prevValue = prevAcc?.value ?? 0;
      const currValue = acc.value;

      // Find crossed thresholds
      const crossed = thresholds.filter(
        t => prevValue < t && currValue >= t
      );

      if (crossed.length > 0) {
        const key = `${current.id}-${acc.name}`;
        milestones[key] = crossed;
      }
    });
  }

  return milestones;
}
```

### Option B: Backend Calculation

Add milestone detection to `/api/v1/snapshots` response.

**Recommendation**: Option A is simpler and keeps milestone logic in frontend.

---

## Files to Modify

- [frontend/src/features/portfolio/usePortfolioData.ts](frontend/src/features/portfolio/usePortfolioData.ts) - Add milestone detection
- [frontend/src/features/portfolio/PortfolioPage.tsx](frontend/src/features/portfolio/PortfolioPage.tsx) - Pass milestones to SpreadsheetTable

---

## Visual Design

From design draft, milestone cells should:
- Have gold background tint
- Optionally show star icon (★)
- Stand out but not be distracting

CSS already exists in SpreadsheetTable:
```css
.value-milestone {
  /* Gold highlighting */
}
```

---

## Dependencies

- SpreadsheetTable component already supports milestones prop
- usePortfolioData hook already fetches snapshots

---

## Verification

1. Create snapshots with values crossing thresholds:
   - Jan: Nordnet ASK = 95,000
   - Feb: Nordnet ASK = 105,000 (crosses 100k)
2. Navigate to Portfolio page
3. Verify Feb row shows gold highlight for Nordnet ASK column
4. Verify milestone appears only on first crossing

---

## Implementation Summary

### Changes Made

1. **Added milestone detection function** (`frontend/src/features/portfolio/usePortfolioData.ts`):
   - `detectMilestones(snapshots)` function compares consecutive snapshots
   - Detects when account values cross thresholds (10k, 20k... 100k, 200k... 1M increments)
   - Returns map of `snapshotId-accountName` to array of crossed thresholds
   - Handles negative values (debt) by using absolute values

2. **Updated data structure** (`frontend/src/features/portfolio/usePortfolioData.ts`):
   - New `PortfolioData` interface containing both rows and milestones
   - `fetchPortfolioData()` now returns `{ rows, milestones }` instead of just rows
   - Maintains backward compatibility in query hook

3. **Transformed milestone keys** (`frontend/src/features/portfolio/PortfolioPage.tsx`):
   - Added `transformedMilestones` memo that maps `snapshotId-accountName` keys to `snapshotId-accountConfigId`
   - Enables proper cell lookup by combining snapshot ID and column ID
   - Passed `transformedMilestones` to SpreadsheetTable component

4. **Updated SpreadsheetTable component** (`frontend/src/shared/components/SpreadsheetTable.tsx`):
   - Modified to use `rowId-columnId` key format when looking up milestones
   - Constructs milestone key dynamically for each cell render
   - Passes milestone array to `formatCell()` function

### How It Works

1. When portfolio data loads, `detectMilestones()` compares consecutive snapshots (sorted by date ascending)
2. For each account, detects threshold crossings between consecutive months
3. Only first crossing of each threshold is recorded
4. Milestones are transformed from account names to config IDs for proper table lookup
5. SpreadsheetTable renders gold star (★) and gold text for cells with milestones
6. Milestones appear only on the specific snapshot where threshold was crossed

### Technical Details

- **Threshold progression**: 10k increments to 100k, then 100k increments to 1M, then 1M increments
- **Absolute value handling**: Debt accounts (negative values) use absolute values for milestone detection
- **Key format**: `${snapshotId}-${columnId}` for unique cell identification
- **Styling**: Existing CSS (`.value-milestone`) provides gold star and text color
- **Performance**: O(n*m) complexity where n = snapshots, m = accounts per snapshot

### Files Modified

- `frontend/src/features/portfolio/usePortfolioData.ts` - Added milestone detection
- `frontend/src/features/portfolio/PortfolioPage.tsx` - Transform and pass milestones
- `frontend/src/shared/components/SpreadsheetTable.tsx` - Use milestone keys for cell lookup

### Build Status

✓ TypeScript compilation successful
✓ Build completed without errors
✓ CSS styling already in place

---

## Resolution

**Status**: COMPLETED (2025-12-03)

Implemented milestone detection for Portfolio table. Cells now display gold star (★) and gold text when account values first cross threshold milestones.

**Playwright Verification**: PASS - No console errors, screenshot captured at `.playwright-output/milestone-detection.png`
