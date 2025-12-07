---
name: summarize-session
description: Compact the conversation context by summarizing what was accomplished and updating CLAUDE.md with any learnings. Use when context is getting long or when transitioning between work sessions.
---

# Compact Context Skill

This skill performs **context compaction** - summarizing the current session and persisting valuable learnings to CLAUDE.md.

**Purpose**: Reduce context length while preserving important information for future sessions.

---

## When to Use

Use this skill when:
- Context is getting long (lots of back-and-forth)
- Transitioning between work sessions
- User explicitly asks to compact or summarize
- Before starting a major new task
- After completing significant work

---

## Workflow

### Phase 1: Session Analysis

Review the current conversation and identify:

1. **Work Completed**
   - Files created/modified
   - Features implemented
   - Bugs fixed
   - Refactoring done

2. **Decisions Made**
   - Architectural choices
   - Pattern preferences
   - Naming conventions established
   - Trade-offs chosen

3. **Problems Encountered**
   - Errors and how they were resolved
   - Gotchas discovered
   - Workarounds applied

4. **User Preferences Revealed**
   - Communication style
   - Code style preferences
   - Workflow preferences

5. **Learnings About the Codebase**
   - Patterns not documented in CLAUDE.md
   - Important file locations
   - Integration details
   - Quirks or edge cases

---

### Phase 2: CLAUDE.md Update Evaluation

Read the current [CLAUDE.md](../../CLAUDE.md) and evaluate if any learnings should be added.

**Threshold: Only add if it meets ALL THREE criteria:**

1. **Reusable** - Will apply to future work (not a one-time fix)
2. **Non-obvious** - Not something a senior dev would assume
3. **Project-specific** - Unique to this codebase, not general knowledge

**Examples that PASS the threshold:**
- "PageHeader must always be centered" - reusable, non-obvious, project-specific
- "Rate limit is 10 req/min for calculators" - reusable, non-obvious, project-specific
- "Use numeral.js nb locale for Norwegian formatting" - reusable, non-obvious, project-specific

**Examples that FAIL the threshold:**
- "Fixed a typo in LoginPage" - not reusable
- "Use async/await in Express" - obvious to senior devs
- "React components use JSX" - not project-specific
- "Added error handling to API call" - standard practice

**When in doubt, don't add.** CLAUDE.md should stay lean and high-signal.

---

### Phase 3: Update CLAUDE.md

If learnings warrant documentation:

1. Read CLAUDE.md to find the appropriate section
2. Add the learning in the correct location
3. Keep additions concise and consistent with existing style
4. Use the same formatting patterns already in the file

**Placement Guidelines**:

| Learning Type | Where to Add |
|---------------|--------------|
| New tech/dependency | Tech Stack section |
| New pattern/convention | Coding Standards section |
| New page or feature | Pages section |
| New API endpoint | API Design section |
| Security concern | Security section |
| User preference | NOTES FROM THE USER section |
| Development tip | Development Setup section |

---

### Phase 4: Context Summary

Produce a compact summary with this structure:

```markdown
## Session Summary

### Completed
- [Bullet list of work done]

### Files Changed
- [List of significant files modified]

### Decisions
- [Key decisions made during session]

### Open Items
- [Anything left incomplete or for next session]

### CLAUDE.md Updates
- [What was added, if anything]
```

---

## Output

The skill produces:
1. **Updates to CLAUDE.md** (if warranted)
2. **Session summary** (displayed to user)

The summary becomes the new context for continuing work, replacing the long conversation history.

---

## Example Session Summary

```markdown
## Session Summary

### Completed
- Fixed TypeScript strict mode errors in backend/
- Implemented rate limiting middleware
- Added Norwegian number formatting utility
- Created user profile API endpoint

### Files Changed
- backend/src/middleware/rateLimiter.ts (new)
- backend/src/controllers/userController.ts (modified)
- frontend/src/shared/utils/numberFormat.ts (new)
- backend/tsconfig.json (modified - enabled strict)

### Decisions
- Rate limit: 100 req/min general, 10 req/min calculators
- Number format: numeral.js with custom nb locale
- Profile updates require email verification

### Open Items
- E2E test for rate limiting

### CLAUDE.md Updates
- Added rate limiting values to Security section
- Added numeral.js to Tech Stack
```

---

## Critical Rules

1. **Be concise** - Summaries should be short, not verbose
2. **Preserve essential info** - Don't lose important context
3. **Update CLAUDE.md sparingly** - Only add truly reusable learnings
4. **Match existing style** - Follow CLAUDE.md formatting conventions
5. **Focus on actionable** - Summaries should help future work
6. **Don't duplicate** - Don't add what's already documented

---

## Triggering This Skill

The user can invoke with:
- "compact context"
- "summarize session"
- "what did we accomplish"
- "update claude.md with learnings"
- "compress the context"
- "session summary"
