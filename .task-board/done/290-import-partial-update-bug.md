# Import: Partial Update Overwrites Other Cells

**Status**: Done
**Completed**: 2025-12-10

## Problem
When user tells the import agent to update a single value (e.g., "jeg har 10 000 i studielån"), the agent overwrites the entire row with zeros for all other accounts instead of only updating the specified cell.

## Scenario
1. User has existing snapshot with: Nordnet=500k, Kron=300k, Studielån=-180k
2. User says: "Studielånet er nå 170 000"
3. Agent creates/updates snapshot with: Nordnet=0, Kron=0, Studielån=-170k
4. **Expected**: Only Studielån updated, other values preserved

## Root Cause
The import agent's `upsert_snapshot` tool likely replaces the entire accounts array instead of merging with existing data.

## Expected Behavior
When user provides partial data:
1. Fetch existing snapshot for that month (if exists)
2. Merge new values with existing values
3. Only overwrite fields explicitly mentioned
4. Preserve all other account values

## Implementation Options

### Option A: Smart merge in upsert_snapshot tool
```typescript
// Merge incoming accounts with existing
const existingSnapshot = await getSnapshot(userId, date);
if (existingSnapshot) {
  const mergedAccounts = existingSnapshot.accounts.map(existing => {
    const updated = newAccounts.find(a => a.id === existing.id);
    return updated || existing;
  });
}
```

### Option B: Improve agent prompting
Instruct the agent to:
1. Always fetch existing snapshot first
2. Include all existing values when upserting
3. Only modify explicitly mentioned accounts

### Option C: New tool for single-cell updates
Create `update_account_value` tool that updates one account in one snapshot without touching others.

## Files to Update
- `backend/src/services/importAgentService.ts` - agent logic and tools
- Tool definitions for snapshot manipulation
- Agent system prompt (if needed)

## Acceptance Criteria
- [x] Partial updates preserve existing account values
- [x] "Jeg har 10k i studielån" only updates studielån
- [x] Other accounts in same snapshot remain unchanged
- [x] Works for both new and existing snapshots

## Implementation Log

### Changes Made
Implemented smart merge logic in `executeUpsertSnapshot` function (backend/src/services/importAgentService.ts):

1. **Merge Strategy**: When updating existing snapshot, merge incoming accounts with existing ones
   - Case-insensitive name matching (lowercase + trim)
   - Preserve existing account IDs when updating values
   - Keep all accounts not mentioned in the update
   - Add new accounts that don't exist yet

2. **Logic Flow**:
   - If snapshot exists: Smart merge (lines 304-371)
     - Map incoming accounts by normalized name
     - Update existing accounts that match incoming names
     - Preserve accounts not mentioned
     - Append genuinely new accounts
   - If snapshot doesn't exist: Create new with provided accounts (lines 372-411)

3. **Enhanced Logging**: Added accountsUpdated and accountsPreserved metrics to log

### Testing Notes
- Build verified successfully
- Merge uses case-insensitive matching to handle variations like "Studielån" vs "studielån"
- Account IDs are preserved during updates to maintain referential integrity
- Total net worth is recalculated after merge
