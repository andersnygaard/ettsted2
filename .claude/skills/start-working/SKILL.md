---
name: start-working
description: Continue work on the next priority from the issue tracking system. This skill should be used when the user asks to start working, continue work, or pick up the next task. Follows the lightweight issue workflow (backlog → in-progress → done) with real-time progress tracking.
---

# Start Working Skill

This skill provides a structured workflow for continuing work on the next priority from the issue tracking system. It automates the process of selecting, planning, implementing, and completing issues following the project's lightweight, checkbox-based workflow.

**CRITICAL**: Never commit and push unless explicitly confirmed by the user first.

## When to Use This Skill

Use this skill when the user requests:
- "Start working on the next task"
- "Continue work" or "Keep going"
- "Pick up the next priority"
- "Work on the planning board items"
- Any request to begin implementation work

## Workflow Overview

This skill follows a **10-step workflow** that moves issues through the lifecycle:

```
backlog/ → in-progress/ → done/
```

With continuous updates to `PLANNING-BOARD.md` throughout the process.

## The 10-Step Workflow

### Step 1: Check Current Priorities

Read [`issue-tracking/PLANNING-BOARD.md`](../../../issue-tracking/PLANNING-BOARD.md) to see what's next.

**If PLANNING-BOARD is empty**: Ask the user if they want to reprioritize the backlog first.

### Step 2: Select Top Priority

Pick the **first item** from the planning board (unless blocked or user specifies otherwise).

**Decision criteria**:
- Is it blocked by dependencies?
- Are all prerequisites met?
- Is the scope clear?

If the top priority is blocked, move to the next unblocked item.

### Step 3: Move to In-Progress

Move the issue file from `issue-tracking/backlog/` to `issue-tracking/in-progress/`.

**Example**:
```bash
Move: issue-tracking/backlog/FEATURE-header-menu.md
  To: issue-tracking/in-progress/FEATURE-header-menu.md
```

### Step 4: Read the Issue File

Thoroughly understand:
- **Problem Statement**: What needs to be fixed/built?
- **Acceptance Criteria**: What defines success?
- **Technical Context**: Affected components, file paths
- **Related Issues**: Any dependencies or cross-references?

### Step 5: Clarify Uncertainties (Critical)

**STOP and ask the user follow-up questions if**:
- The issue description is unclear or ambiguous
- Multiple implementation approaches are possible
- There are technical uncertainties about the approach
- The scope seems too large or ill-defined
- Priority conflicts exist

**Only proceed to Step 6 after all uncertainties are resolved**.

### Step 6: Assess Complexity

Evaluate if the task is appropriately sized:

**If task is too complex**:
- Break it down into smaller, focused sub-tasks
- Create new issue files in `backlog/` for each sub-task
- Update `PLANNING-BOARD.md` with the new breakdown
- Select the first sub-task to work on

**Complexity indicators**:
- Affects more than 5 files
- Requires changes across multiple layers
- Estimated effort > 4 hours

### Step 7: Add Implementation Plan

Update the issue file with a **detailed Implementation Plan** section:

```markdown
## Implementation Plan

**Approach**: [Strategy and high-level steps]

**Files to modify**:
- `src/App.tsx` - Update routes
- `src/features/calculator/CalculatorPage.tsx` - Modify component

**Dependencies**: [Any blockers or prerequisites]

**Estimated effort**: [Time estimate]
```

### Step 8: Update Planning Board

Mark the issue as **"In Progress"** in `PLANNING-BOARD.md` with status notes.

**Update format**:
```markdown
### 1. **[Issue Title]** (IN PROGRESS)
**Issue**: `in-progress/FEATURE-header-menu.md`
**Status**: Implementation started
**Progress**: 2/4 acceptance criteria met
```

### Step 9: Implement the Solution

Follow this approach:

1. **Review existing code**:
   - Search for existing patterns in the codebase
   - Understand current implementation

2. **Implement changes**:
   - Make minimal changes to meet acceptance criteria
   - Follow project architecture patterns (see below)

3. **Verify build passes**:
   - Run `npm run build` to check TypeScript + Vite build
   - Fix any errors immediately

#### Architecture Patterns to Follow

**Frontend (React 19 + TypeScript + Vite)**:
- **Feature-based structure**: Code in `src/features/{feature}/`
- **Components**: Keep components simple and focused
- **Routing**: Use React Router, `ProtectedRoute` wrapper for auth-required routes
- **Styling**: BeerCSS (Material Design) - use class-based styling
- **Charts**: D3 for visualizations

**Auth (Azure EasyAuth)**:
- `/.auth/me` endpoint returns user info
- `ProtectedRoute` checks auth state and redirects unauthenticated users to `/`

**Deployment**:
- `package.bat` - Build + create deploy/deploy.zip
- `deploy.bat` - Deploy to Azure (finans.azurewebsites.net)
- `server.js` - Node.js static server with SPA fallback routing

#### Real-Time Progress Tracking

**Update the issue file's Progress Log frequently**:

```markdown
## Progress Log
- 2025-11-23 14:30 - Started implementation, reviewed existing components
- 2025-11-23 14:45 - Updated App.tsx routes
- 2025-11-23 15:00 - Created new component
- 2025-11-23 15:15 - Build passing, all criteria met
```

**Update PLANNING-BOARD.md as work progresses**:
- Add status notes ("Working on routes", "Implementation complete")
- Update progress percentage or checklist items
- Note any blockers or scope changes

### Step 10: Complete and Move to Done

Before marking complete, verify the **Verification Checklist**:

```markdown
## Verification
- [ ] All acceptance criteria met
- [ ] Build passes (`npm run build`)
- [ ] Manual testing completed
- [ ] Documentation updated (if applicable)
```

**Then finalize**:

1. **Update Resolution section** with final outcome:
   ```markdown
   ## Resolution

   Successfully implemented [feature]. All acceptance criteria met.

   **Changes made**:
   - Updated `src/App.tsx` - Added new routes
   - Created `src/features/xyz/Component.tsx`

   **Verification**:
   - Build passes
   - Manual testing complete
   ```

2. **Move file to done**:
   ```bash
   Move: issue-tracking/in-progress/FEATURE-header-menu.md
     To: issue-tracking/done/FEATURE-header-menu.md
   ```

3. **Update PLANNING-BOARD.md**:
   - Remove completed item from the board
   - Add next priority from backlog (if applicable)
   - Keep board at 3-5 items maximum

## Constraints and Guidelines

### Critical Constraints

1. **Never commit/push without user approval**: Always ask before running git commands
2. **Follow architecture patterns**: Feature-based structure, React patterns
3. **Keep PLANNING-BOARD.md lean**: Maximum 3-5 items, short notes only
4. **Real-time updates**: Update Progress Log frequently during work
5. **One issue at a time**: Don't start multiple issues simultaneously

### Build Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
package.bat      # Build + create deploy/deploy.zip
deploy.bat       # Deploy to Azure
```

### Documentation Requirements

Update docs **BEFORE, DURING, and AFTER** work:
- **BEFORE**: Update status in issue file
- **DURING**: Track implementation progress in Progress Log
- **AFTER**: Update with results, file changes

## Success Criteria

A work session is complete when:

- [ ] Top priority issue moved to `in-progress/`
- [ ] Implementation plan added to issue file
- [ ] `PLANNING-BOARD.md` status updated
- [ ] Solution implemented following all acceptance criteria
- [ ] Build passes (`npm run build`)
- [ ] Issue file updated with final status and Resolution
- [ ] Issue moved to `done/`
- [ ] `PLANNING-BOARD.md` updated (item removed, next priority added if applicable)

## Handling Edge Cases

### If PLANNING-BOARD is Empty

Ask the user:
```
The PLANNING-BOARD is currently empty. Would you like me to:
1. Review the backlog and suggest priorities?
2. Wait for you to add priorities manually?
3. Create a new issue from a bug/feature report?
```

### If Top Priority is Blocked

Identify the blocker and ask:
```
The top priority is blocked by [dependency]. Would you like me to:
1. Work on the blocker first?
2. Skip to the next unblocked item?
3. Re-prioritize the board?
```

### If Issue is Unclear

**ALWAYS ask clarifying questions** before proceeding. Examples:
- "The acceptance criteria mention 'improve X'. What specific outcome?"
- "Should this work for all users or just authenticated users?"
- "Which approach do you prefer: A or B?"

### If Task is Too Large

Break it down:
```
This task seems too complex for a single issue. I recommend breaking it into:

1. FEATURE-xyz-part1.md (sub-task 1)
2. FEATURE-xyz-part2.md (sub-task 2)

Should I create these sub-issues and start with part 1?
```

## Project Structure

```
finans-app/
├── src/
│   ├── App.tsx              # Main app with routing
│   ├── features/
│   │   ├── auth/            # LoginPage, UserInfo (EasyAuth)
│   │   ├── calculator/      # Compound interest calculator + D3 charts
│   │   ├── dashboard/       # Main dashboard after login
│   │   └── home/            # Public landing page
│   └── main.tsx
├── issue-tracking/
│   ├── PLANNING-BOARD.md    # Current priorities
│   ├── backlog/             # Pending issues
│   ├── in-progress/         # Active work
│   └── done/                # Completed issues
├── deploy/                  # Deployment artifacts
├── server.js                # Production Node server
├── package.bat              # Build script
└── deploy.bat               # Azure deployment
```
