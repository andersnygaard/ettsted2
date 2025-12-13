# 120-FEATURE: Preload User Accounts in Import Agent

**Priority**: High
**Effort**: Medium (1-2 hours)
**Labels**: backend, llm, import

---

## Context

Currently the import agent calls `get_user_accounts` tool each time to fetch the user's configured accounts. This is inefficient and adds latency to every import session.

The agent should be preloaded with the user's accounts in the system prompt, including clear instructions for fuzzy name matching.

Users may paste data with:
- More columns than configured accounts
- Fewer columns than configured accounts
- Different naming conventions (e.g., "Nordnet" vs "Nordnet ASK")

---

## Acceptance Criteria

- [x] Fetch user accounts before starting the agent loop
- [x] Include accounts list in the system prompt
- [x] Add instructions for fuzzy name matching (case-insensitive, partial matches)
- [x] Handle cases where pasted data doesn't match 1:1 with accounts
- [x] Agent should ask for clarification when ambiguous
- [x] Remove redundant `get_user_accounts` tool calls where possible

---

## Technical Approach

1. In `runImportAgent()`, fetch user accounts via `getUserById()` before building messages
2. Extend `SYSTEM_PROMPT` with:
   - JSON list of configured accounts
   - Matching rules (case-insensitive, contains, etc.)
   - Instructions for handling mismatches
3. Keep `get_user_accounts` tool available for edge cases but optimize for common path

---

## Files to Modify

- [importAgentService.ts](backend/src/services/importAgentService.ts)

---

## System Prompt Addition

```
USER'S CONFIGURED ACCOUNTS:
${accountsList || '  (No accounts configured yet)'}

ACCOUNT MATCHING RULES:
1. Match case-insensitively ("nordnet" = "Nordnet ASK")
2. Match partial names ("Aksjer" matches "Nordnet Aksjer", "Nordnet" alone matches "Nordnet ASK")
3. If user pastes MORE columns than accounts, ask which columns to ignore or skip
4. If user pastes FEWER columns, proceed with available data
5. When unsure about matching, list the options and ask user to confirm mapping
6. Use get_user_accounts tool ONLY if user adds new accounts during conversation (edge case)
```

---

## Progress Log

**2025-12-04 - Implementation Complete**

1. Created `buildSystemPrompt(accounts: AccountConfig[])` function to dynamically build the system prompt
   - Formats accounts list as human-readable bulleted items with category labels
   - Handles empty accounts gracefully with fallback message

2. Modified `runImportAgent()` function to:
   - Fetch user accounts via `getUserById()` before starting agent loop
   - Handle fetch failures gracefully (agent can still call get_user_accounts as fallback)
   - Build system prompt with preloaded accounts using `buildSystemPrompt()`
   - Log preloaded account count in starting log and Langfuse trace

3. Enhanced system prompt with:
   - USER'S CONFIGURED ACCOUNTS section (formatted list with categories)
   - ACCOUNT MATCHING RULES with 6 clear rules for fuzzy matching
   - Instructions to use get_user_accounts tool only for edge cases

4. Verified TypeScript compilation succeeds with no errors

---

## Resolution

**Status**: COMPLETE ✓

**Changes Made**:
- `backend/src/services/importAgentService.ts`:
  - Replaced static SYSTEM_PROMPT with dynamic `buildSystemPrompt()` function
  - Added account preloading in `runImportAgent()` before message building
  - Integrated accounts into system prompt with matching rules
  - Added error handling and logging for preload operation

**Build Status**: Success - `pnpm --filter backend build` completes without errors

**Benefits**:
- Eliminates redundant `get_user_accounts` tool calls in common path (faster responses)
- Provides agent with account context upfront for better initial analysis
- Reduces latency and token usage for typical import sessions
- Still supports edge cases where agent calls tool if needed
- Graceful degradation if preload fails
