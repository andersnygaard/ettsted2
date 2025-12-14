# FEATURE: Import Agent Fuzzy Matching & Single Account Updates

**Status**: Backlog
**Created**: 2024-12-14
**Priority**: Medium
**Labels**: backend, import, llm, agent
**Estimated Effort**: Medium - 2-3 days

## Context & Motivation

When users type natural language like "jeg har 1000 kroner i kron", the import agent should:
1. Fuzzy-match "kron" to the user's configured account "Kron"
2. Update only that single cell in the latest snapshot
3. Always confirm with user before saving

Currently the agent relies purely on LLM interpretation for account matching (no actual fuzzy matching code), and requires a full snapshot structure with explicit date for updates.

## Current State

**Existing Tools** (`importAgentService.ts`):
- `get_user_accounts` - Fetches user's configured accounts
- `get_existing_snapshots` - Checks for existing snapshots
- `upsert_snapshot` - Creates/updates full snapshots (requires explicit date, all accounts)

**Account Matching**: LLM guesses based on system prompt instructions - no programmatic fuzzy matching.

**Date Handling**: `upsert_snapshot` requires explicit date in `dd.MM.yyyy` format.

## Desired Outcome

1. **Fuzzy matching utility** - Programmatic account name matching with scoring
2. **Single account update tool** - Update one account value without full snapshot structure
3. **Smart date defaulting** - Default to first of current month if not specified
4. **Confirmation flow** - Always present matches for user confirmation before saving

## Acceptance Criteria

- [ ] User can say "jeg har 1000 i kron" and agent matches to "Kron" account
- [ ] Agent presents fuzzy matches with current values for confirmation
- [ ] User must confirm before any changes are saved
- [ ] Date defaults to first of current month if not specified
- [ ] Multiple fuzzy matches are presented as numbered options
- [ ] No matches returns helpful error with list of user's accounts
- [ ] `upsert_snapshot` accepts optional date (defaults to current month)
- [ ] All existing import functionality continues to work

## Affected Components

### Backend
- **New File**: `backend/src/utils/fuzzyMatch.ts` - Fuzzy matching algorithm
- **Edit**: `backend/src/utils/dateUtils.ts` - Add `getCurrentMonthFirstDay()`
- **Edit**: `backend/src/services/importAgentService.ts` - New tool + system prompt

## Technical Approach

### 1. Fuzzy Matching Algorithm (`fuzzyMatch.ts`)

Scoring strategy (Norwegian-aware):
| Match Type | Score | Example |
|------------|-------|---------|
| Exact match (case-insensitive) | 100 | "kron" → "Kron" |
| Starts with | 90 | "nord" → "Nordnet" |
| Contains | 80 | "lån" → "Boliglån" |
| Levenshtein distance ≤ 1 | 60 | "kron" → "Krom" (typo) |
| Levenshtein distance ≤ 2 | 50 | "sparekont" → "Sparekonto" |

Threshold: 50 (below = no match)

```typescript
interface FuzzyMatchResult {
  accountId: string;
  accountName: string;
  category: string;
  score: number;
}

function fuzzyMatchAccounts(
  searchTerm: string,
  accounts: AccountConfig[],
  threshold?: number
): FuzzyMatchResult[]
```

### 2. Date Helper (`dateUtils.ts`)

```typescript
function getCurrentMonthFirstDay(): string {
  // Returns "01.MM.yyyy" for current month
}
```

### 3. New Tool: `update_single_account`

**Parameters**:
```typescript
{
  searchTerm: string,      // Account name or partial (e.g., "kron")
  value: number,           // New value in NOK
  date?: string,           // Optional, defaults to current month
  confirmed?: boolean,     // True when user confirmed
  confirmedAccountId?: string  // Which account to update (when confirmed)
}
```

**Two-Phase Flow**:

**Phase 1 - Discovery** (no confirmation):
```typescript
// Input: { searchTerm: "kron", value: 1000 }
// Output:
{
  status: 'needs_confirmation',
  matches: [
    { accountId: "acc-1", accountName: "Kron", category: "sparing", currentValue: 500, score: 100 }
  ],
  message: "Fant kontoen 'Kron' (nåværende verdi: 500 kr)."
}
```

**Phase 2 - Execution** (with confirmation):
```typescript
// Input: { searchTerm: "kron", value: 1000, confirmed: true, confirmedAccountId: "acc-1" }
// Output:
{
  status: 'updated',
  updatedAccount: {
    accountId: "acc-1",
    accountName: "Kron",
    oldValue: 500,
    newValue: 1000,
    date: "01.12.2024",
    snapshotId: "snap-123"
  },
  message: "Oppdaterte Kron fra 500 kr til 1 000 kr for 01.12.2024."
}
```

### 4. Enhanced `upsert_snapshot`

- Remove `date` from required array in tool definition
- Add fallback: `const date = args.date || getCurrentMonthFirstDay()`

### 5. System Prompt Updates

Add to `buildSystemPrompt()`:

```
SINGLE ACCOUNT UPDATES:
- When user mentions ONE account (e.g., "jeg har 1000 i kron"), use update_single_account
- Present matches as numbered list with current values
- Always confirm date: "Oppdaterer [account] til [value] for [date]. Er dette riktig?"
- On confirmation, execute and report

DATE HANDLING:
- No date specified → first of current month
- "denne måneden" / "nå" → current month
- "forrige måned" → previous month
```

## Implementation Steps

### Phase 1: Core Utilities
1. Create `backend/src/utils/fuzzyMatch.ts`
   - Implement `levenshteinDistance()` function
   - Implement `calculateScore()` for scoring logic
   - Implement `fuzzyMatchAccounts()` main function
   - Export types and functions

2. Edit `backend/src/utils/dateUtils.ts`
   - Add `getCurrentMonthFirstDay()` function

### Phase 2: Tool Implementation
3. Edit `backend/src/services/importAgentService.ts`
   - Add imports for fuzzyMatch and dateUtils
   - Add `update_single_account` tool definition to TOOLS array
   - Implement `executeUpdateSingleAccount()` function
   - Update `executeTool()` switch to route new tool
   - Make `upsert_snapshot` date optional (remove from required, add fallback)

### Phase 3: System Prompt
4. Edit `backend/src/services/importAgentService.ts`
   - Update `buildSystemPrompt()` with single account guidance
   - Add date handling instructions

### Phase 4: Verification
5. Manual testing scenarios:
   - "jeg har 1000 i kron" → matches Kron, asks confirmation
   - "jeg har 50000 i nord" → matches Nordnet, asks confirmation
   - "jeg har 100000 i xyz" → no matches, lists accounts
   - Multiple similar matches → presents numbered options
   - Confirm with "ja" → executes update

## Dependencies

- **External**: None (existing OpenAI dependency)
- **Internal**:
  - `getUserById` from userService
  - `getSnapshotsByUserId`, `updateSnapshot`, `createSnapshot` from portfolioService
- **Blocking**: None

## Risks & Considerations

| Risk | Mitigation |
|------|------------|
| Fuzzy matching too aggressive | Use threshold of 50, require confirmation |
| LLM bypasses confirmation | System prompt explicitly requires confirmation |
| Edge case: no existing snapshot | Copy from latest snapshot or create minimal |
| Typos in account names | Levenshtein handles small typos |

## Code References

### Existing Tool Pattern
```typescript
// File: backend/src/services/importAgentService.ts
async function executeUpsertSnapshot(
  ctx: ToolContext,
  args: { date: string; accounts: { name: string; value: number; assetClass: string }[] }
): Promise<{ success: boolean; action: 'created' | 'updated'; ... }> {
  // ... existing merge logic is already good
}
```

### Existing Date Utils
```typescript
// File: backend/src/utils/dateUtils.ts
export function parseDate(dateString: string): Date { ... }
export function compareDatesDesc(a: string, b: string): number { ... }
```

## Example Conversation Flow

**User**: "jeg har 1000 kroner i kron"

**Agent iteration 1**:
- Calls `update_single_account({ searchTerm: "kron", value: 1000 })`
- Tool returns: `{ status: 'needs_confirmation', matches: [...] }`

**Agent response**:
"Fant kontoen 'Kron' (nåværende verdi: 500 kr). Vil du oppdatere til 1 000 kr for 01.12.2024?"

**User**: "ja"

**Agent iteration 2**:
- Calls `update_single_account({ ..., confirmed: true, confirmedAccountId: "acc-123" })`
- Tool returns: `{ status: 'updated', message: "..." }`

**Agent response**:
"Ferdig! Oppdaterte Kron fra 500 kr til 1 000 kr for desember 2024."

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
