# 112 - Feature: Delete Snapshot UI

**Type**: FEATURE
**Priority**: Low
**Effort**: Simple (1-2 hours)
**Labels**: frontend, portfolio, ux

---

## Context

Backend supports deleting snapshots via `DELETE /api/v1/snapshots/:id`, but there's no UI to trigger this action.

**Current state**: User cannot delete incorrect or duplicate snapshots.

---

## Acceptance Criteria

- [x] Delete button/icon visible for each row in portfolio table
- [x] Confirmation dialog before deletion
- [x] Optimistic UI update or loading state
- [x] Toast notification on success/failure
- [x] Table refreshes after deletion

---

## Technical Approach

### Option A: Row Action Button (Recommended)

Add delete icon to each row with hover visibility:

```tsx
// In SpreadsheetTable or PortfolioPage
<td className="row-actions">
  <button
    className="delete-btn"
    onClick={() => handleDeleteClick(row.id)}
    aria-label="Slett måned"
  >
    <TrashIcon />
  </button>
</td>
```

### Option B: Context Menu

Right-click on row shows context menu with delete option.

**Recommendation**: Option A is more discoverable.

---

## UI Design

1. **Delete icon**: Show on row hover, right side of row
2. **Confirmation modal**: "Er du sikker på at du vil slette [dato]?"
3. **Toast**: "Måned slettet" on success

---

## Files to Modify

- [frontend/src/features/portfolio/PortfolioPage.tsx](frontend/src/features/portfolio/PortfolioPage.tsx) - Add delete handler
- [frontend/src/features/portfolio/usePortfolioData.ts](frontend/src/features/portfolio/usePortfolioData.ts) - Add delete mutation
- [components/src/data/SpreadsheetTable/SpreadsheetTable.tsx](components/src/data/SpreadsheetTable/SpreadsheetTable.tsx) - Optional: add actions column support

---

## API Integration

```typescript
// usePortfolioData.ts
export function useDeleteSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (snapshotId: string) =>
      api.delete(`/snapshots/${snapshotId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Måned slettet');
    },
    onError: () => {
      toast.error('Kunne ikke slette måned');
    },
  });
}
```

---

## Dependencies

- DELETE endpoint already exists in backend
- Modal component available
- Toast component available

---

## Verification

1. Navigate to Portfolio page
2. Hover over a row
3. Click delete icon
4. Confirm in dialog
5. Verify row disappears from table
6. Refresh page - row should still be gone

---

## Implementation Summary

### Files Modified

1. **frontend/src/features/portfolio/PortfolioPage.tsx**
   - Added delete confirmation modal state
   - Added `handleDeleteClick`, `handleDeleteCancel`, `handleDeleteConfirm` handlers
   - Integrated `useDeleteSnapshot` mutation hook
   - Integrated `useToast` for success/error notifications
   - Added delete handler to row data for SpreadsheetTable
   - Added confirmation modal with Norwegian text

2. **components/src/data/SpreadsheetTable/SpreadsheetTable.tsx**
   - Added `onRowDelete` prop to SpreadsheetTableProps interface
   - Updated RowData type to allow any properties (for _deleteHandler)
   - Added delete button column to table header (sticky, right-aligned)
   - Added delete button to each table row with emoji icon (🗑️)
   - Delete button appears on row hover with smooth transitions

3. **components/src/data/SpreadsheetTable/SpreadsheetTable.css**
   - Added `.action-header` styling for action column header
   - Added `.action-cell` styling for delete button container (sticky right positioning)
   - Added `.delete-button` styling with hover/active states
   - Delete button hidden by default, shown on row hover
   - Uses negative (red) color for emphasis
   - Smooth opacity and background transitions

### User Experience Flow

1. User hovers over a row in the portfolio table
2. Trash icon (🗑️) appears on the right side with semi-opacity (0.6)
3. User clicks the delete button
4. Confirmation modal opens with message: "Er du sikker på at du vil slette [dato]?"
5. User can click "Avbryt" to cancel or "Slett" to confirm
6. On confirmation, delete button shows "Sletter..." loading state
7. Backend processes deletion and invalidates all related queries
8. Table automatically refreshes with row removed
9. Toast notification appears: "Måned slettet" (green success)
10. If error occurs: "Kunne ikke slette måned" (red error)

### Technical Details

- Delete button uses trash emoji (🗑️) for universal recognition
- Button only appears on hover to reduce visual clutter
- Action column is sticky-positioned on the right (z-index: 4)
- Handles row data with internal `_deleteHandler` callback
- Proper TypeScript typing with fallback to handle any property types
- Mutation invalidates all related queries: portfolio, dashboard, sparing, gjeld, pensjon
- Norwegian text throughout for consistency with app locale
