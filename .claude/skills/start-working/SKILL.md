---
name: start-working
description: Continue work on the next priority from the task backlog. Use this skill when the user asks to start working, continue work, or pick up the next task. Follows the task-board workflow (backlog → in-progress → done) with implementation tracking.
---

# Start Working Skill

This skill provides a structured workflow for continuing work on the next priority from the task backlog. It automates the process of selecting, planning, implementing, and completing tasks following the finans project's task-board workflow.

**CRITICAL**: Never commit and push unless explicitly confirmed by the user first.

## When to Use This Skill

Use this skill when the user requests:
- "Start working on the next task"
- "Continue work" or "Keep going"
- "Pick up the next priority"
- "Work on the planning board items"
- "Start implementing" or "Begin development"
- Any request to begin implementation work

## Workflow Overview

This skill follows a **10-step workflow** that moves tasks through the lifecycle:

```
.task-board/backlog/ → .task-board/in-progress/ → .task-board/done/
```

With continuous updates to `PLANNING-BOARD.md` throughout the process.

## The 10-Step Workflow

### Step 1: Check Current Priorities

Read [`.task-board/PLANNING-BOARD.md`](../../.task-board/PLANNING-BOARD.md) to see what's next.

**If PLANNING-BOARD is empty**: Ask the user if they want to add priorities from the backlog first.

**Example response**:
```
The PLANNING-BOARD is currently empty. Would you like me to:
1. Add the top 3-5 priorities from backlog to the planning board?
2. Wait for you to manually select priorities?
3. Review the entire backlog and make recommendations?
```

### Step 2: Select Top Priority

Pick the **first item** from the planning board (unless blocked or user specifies otherwise).

**Decision criteria**:
- Is it blocked by dependencies?
- Are all prerequisites met (check "Related Plans" section)?
- Is the scope clear and actionable?
- Are there any unresolved questions in the plan?

If the top priority is blocked, move to the next unblocked item.

**Blocking examples**:
- Task `006-FEATURE-user-api-endpoints.md` is blocked if `001-FEATURE-backend-express-server.md` is not done
- Task `009-FEATURE-portfolio-dashboard.md` is blocked if `008-FEATURE-portfolio-api-endpoints.md` is not done

### Step 3: Move to In-Progress

Move the task file from `.task-board/backlog/` to `.task-board/in-progress/`.

**Example**:
```bash
Move: .task-board/backlog/001-FEATURE-backend-express-server.md
  To: .task-board/in-progress/001-FEATURE-backend-express-server.md
```

**Important**: Limit in-progress work to **1-2 tasks maximum**. If in-progress folder already has tasks, ask user if they want to finish those first.

### Step 4: Read the Task File

Thoroughly understand the task plan:
- **Context & Motivation**: Why is this work needed?
- **Current State**: What exists today?
- **Desired Outcome**: What success looks like
- **Acceptance Criteria**: Specific, testable requirements (checkboxes)
- **Technical Approach**: Implementation steps and architecture decisions
- **Dependencies**: What must be completed first
- **Risks**: Potential issues and mitigations
- **Code References**: Relevant patterns and examples

### Step 5: Clarify Uncertainties (Critical)

**STOP and ask the user follow-up questions if**:
- The task description is unclear or ambiguous
- Multiple implementation approaches are possible
- There are technical uncertainties about the approach
- The scope seems too large or ill-defined
- Priority conflicts exist
- Dependencies are unclear
- Norwegian localization requirements are ambiguous

**Only proceed to Step 6 after all uncertainties are resolved**.

**Example questions**:
- "Should the portfolio dashboard show all snapshots or just the last 12 months?"
- "For error handling, should we show toast notifications or inline errors?"
- "The plan mentions 'optional D3.js chart' - should I implement this or skip it for MVP?"

### Step 6: Assess Complexity

Evaluate if the task is appropriately sized:

**If task is too complex**:
- Break it down into smaller, focused sub-tasks
- Create new task files in `backlog/` for each sub-task (continue numbering sequence)
- Update `PLANNING-BOARD.md` with the new breakdown
- Select the first sub-task to work on

**Complexity indicators for finans project**:
- Affects both frontend AND backend (consider splitting)
- Requires changes across more than 3 workspaces (frontend/backend/components)
- Estimated effort > 1 week
- Multiple new dependencies or integrations (CosmosDB + API + UI)

**Example breakdown**:
```
Original: 009-FEATURE-portfolio-dashboard.md (too complex)

Break into:
- 009a-FEATURE-portfolio-api-integration.md (fetch snapshots)
- 009b-FEATURE-net-worth-chart.md (D3.js chart only)
- 009c-FEATURE-account-table.md (account breakdown table)
```

### Step 7: Add Implementation Plan

Update the task file with a **detailed Implementation Plan** section.

The plan file already has "Implementation Plan" as a placeholder section. Fill it in with:

```markdown
## Implementation Plan

**Phase 1: Backend Setup** (if applicable)
- [ ] Create Express routes in `/backend/src/routes/`
- [ ] Implement controllers in `/backend/src/controllers/`
- [ ] Add validation in `/backend/src/validators/`
- [ ] Set up CosmosDB service methods
- [ ] Test with Postman/curl

**Phase 2: Frontend Implementation** (if applicable)
- [ ] Create feature folder in `/frontend/src/features/[feature-name]/`
- [ ] Implement components (React + TypeScript)
- [ ] Add TanStack Query hooks for API calls
- [ ] Set up Zustand store if needed (client state)
- [ ] Apply BeerCSS styling
- [ ] Add Norwegian text and formatting

**Phase 3: Testing**
- [ ] Manual testing in dev environment
- [ ] Verify all acceptance criteria met
- [ ] Test Norwegian number/date formatting
- [ ] Test error cases

**Phase 4: Verification**
- [ ] Frontend builds: `pnpm --filter frontend build`
- [ ] Backend builds: `pnpm --filter backend build`
- [ ] TypeScript type-check passes
- [ ] ESLint passes
- [ ] All acceptance criteria checked off

**Files to create/modify**:
- `/backend/src/routes/userRoutes.ts` (new)
- `/backend/src/controllers/userController.ts` (new)
- `/frontend/src/features/auth/LoginPage.tsx` (new)
- `/frontend/src/shared/api/client.ts` (modify)

**Dependencies**:
- Requires `.env` files configured
- Requires CosmosDB Emulator running (run `emulator.bat`)

**Estimated total time**: 2-3 days
```

### Step 8: Update Planning Board

Mark the task as **"In Progress"** in `PLANNING-BOARD.md` with status notes.

**Update format**:
```markdown
## Top Priorities

### 1. Backend Express Server Setup (Effort: Medium - 2-3 days) - IN PROGRESS ⚙️
**File**: `in-progress/001-FEATURE-backend-express-server.md`
**Why Now**: Foundation for all API development
**Status**: Phase 1 complete - setting up middleware
**Progress**: 3/12 acceptance criteria met
**Started**: 2025-11-28
```

### Step 9: Implement the Solution

Follow the finans project architecture patterns and implementation workflow:

#### Development Environment Setup

**Start development servers** (if not already running):
```bash
# Backend dev server (Express + nodemon)
pnpm --filter backend dev

# Frontend dev server (Vite)
pnpm --filter frontend dev

# Both in parallel (from root)
pnpm dev
```

**CosmosDB Emulator** (if working with database):
```bash
# Start emulator
.\emulator.bat

# Verify running at https://localhost:8081/_explorer/
```

#### Architecture Patterns to Follow

**Backend (Express + TypeScript + CosmosDB)**:
- **Folder structure**: Follow vertical organization
  - Routes in `/backend/src/routes/`
  - Controllers in `/backend/src/controllers/`
  - Services in `/backend/src/services/` (CosmosDB access)
  - Validation in `/backend/src/validators/`
  - Middleware in `/backend/src/middleware/`
- **Error handling**: Use custom error classes, global error handler
- **Logging**: Winston logger for structured logging
- **Validation**: Two-layer (input validation + business validation)
- **API format**:
  - Success: `{ data: {...}, success: true }`
  - Error: `{ error: { message, code, details }, success: false }`

**Frontend (React 18 + Vite + TanStack Query + Zustand)**:
- **Folder structure**: Vertical slicing by feature
  - Features in `/frontend/src/features/[feature-name]/`
  - Shared components in `/frontend/src/shared/components/`
  - Shared hooks in `/frontend/src/shared/hooks/`
  - Stores in `/frontend/src/stores/` (Zustand)
- **State management**:
  - **TanStack Query**: All server state (API calls)
  - **Zustand**: Client state (UI preferences, local state)
  - **React Context**: Auth state only
- **Components**: Functional components with TypeScript
- **Styling**: BeerCSS classes + Material UI icons
- **Forms**: React Hook Form + Zod validation
- **Norwegian**: All UI text in Norwegian, use format utilities from `shared/utils/`

**Norwegian Localization** (CRITICAL):
- **Numbers**: `formatCurrency(123456.78)` → `"123 456,78 kr"`
- **Dates**: `formatDate(new Date())` → `"28.11.2025"`
- **Import utilities**:
  ```typescript
  import { formatCurrency, formatNumber, parseNumber } from '@/shared/utils/numberFormat';
  import { formatDate, parseDate } from '@/shared/utils/dateFormat';
  ```

**Component Library** (`/components`):
- Shared components bundled into frontend (not published to npm)
- Import: `import { Button, Card } from '@finans/components'`
- Storybook for documentation (future)

#### Implementation Workflow

1. **Read the Technical Approach section** in the task file thoroughly

2. **Follow the phased approach** from Implementation Plan:
   - Complete Phase 1 before moving to Phase 2
   - Check off tasks as you complete them
   - Update Progress Log frequently

3. **Code incrementally**:
   - Create/modify one file at a time
   - Test each change before moving to next
   - Keep TypeScript compilation clean (no errors)

4. **Follow existing patterns**:
   - Check "Code References" section in task file
   - Look for similar implementations in codebase
   - Maintain consistency with existing code

5. **Test continuously**:
   - Manual testing after each change
   - Verify acceptance criteria as you go
   - Test Norwegian formatting with real data

#### Real-Time Progress Tracking

**Update the task file's Progress Log frequently** (every 30-60 minutes):

```markdown
## Progress Log
- 2025-11-28 14:00 - Started implementation, reviewed task plan
- 2025-11-28 14:30 - Created Express app in /backend/src/index.ts
- 2025-11-28 15:00 - Added Winston logger configuration
- 2025-11-28 15:30 - Implemented error handler middleware
- 2025-11-28 16:00 - Tested health endpoint - working ✓
- 2025-11-28 16:30 - Added rate limiting middleware
```

**Update PLANNING-BOARD.md as phases complete**:
```markdown
**Status**: Phase 2 complete - frontend components built
**Progress**: 8/12 acceptance criteria met
```

#### Testing Guidelines

**Frontend testing**:
- Manual testing in browser (http://localhost:5173)
- Check browser console for errors
- Test responsive design (mobile/desktop)
- Verify Norwegian formatting
- Test all user interactions
- Future: Playwright E2E tests (see task 017)

**Backend testing**:
- Test with Postman or curl
- Verify response format
- Test error cases (400, 401, 404, 500)
- Check Winston logs
- Future: Jest unit tests

**Build verification**:
```bash
# Frontend build
pnpm --filter frontend build

# Backend build
pnpm --filter backend build

# Lint all
pnpm lint

# Type-check
pnpm --filter frontend type-check
pnpm --filter backend type-check
```

### Step 10: Complete and Move to Done

Before marking complete, verify the **Verification Checklist** (in task file):

```markdown
## Verification
- [ ] All acceptance criteria met
- [ ] Frontend builds successfully (`pnpm --filter frontend build`)
- [ ] Backend builds successfully (`pnpm --filter backend build`)
- [ ] TypeScript compilation clean (no errors)
- [ ] ESLint passes
- [ ] Manual testing complete
- [ ] Norwegian formatting verified
- [ ] Error handling tested
- [ ] Code reviewed (self-review)
```

**Then finalize**:

1. **Update Resolution section** with final outcome:
   ```markdown
   ## Resolution

   Successfully implemented backend Express server with complete middleware stack.

   **Implementation Summary**:
   - Created Express app with TypeScript in `/backend/src/index.ts`
   - Configured Winston logger for structured logging
   - Implemented global error handler in `/backend/src/middleware/errorHandler.ts`
   - Added rate limiting middleware (100 req/min general, 10 req/min calculators)
   - Set up CORS for frontend access
   - Created health check endpoint at `/api/v1/health`
   - Configured graceful shutdown handlers

   **Files created**:
   - `/backend/src/index.ts` - Main server entry point
   - `/backend/src/config/environment.ts` - Environment validation
   - `/backend/src/utils/logger.ts` - Winston logger
   - `/backend/src/middleware/errorHandler.ts` - Global error handler
   - `/backend/src/middleware/rateLimiter.ts` - Rate limiting
   - `/backend/src/routes/index.ts` - Route aggregator

   **Test results**:
   - ✅ Server starts on port 3000
   - ✅ Health endpoint responds: `GET http://localhost:3000/api/v1/health`
   - ✅ CORS allows frontend origin
   - ✅ Rate limiting works (tested with multiple requests)
   - ✅ Error responses follow standard format
   - ✅ TypeScript build succeeds
   - ✅ All 12 acceptance criteria met

   **Next steps**:
   - Ready for `002-FEATURE-cosmosdb-connection.md`
   ```

2. **Move file to done**:
   ```bash
   Move: .task-board/in-progress/001-FEATURE-backend-express-server.md
     To: .task-board/done/001-FEATURE-backend-express-server.md
   ```

3. **Update PLANNING-BOARD.md**:
   - Remove completed item from "Top Priorities"
   - Add to "Recently Completed" section
   - Add next priority from backlog (if applicable)
   - Keep board at 3-5 items maximum

   ```markdown
   ## Recently Completed

   - ✅ **001-FEATURE-backend-express-server** (Completed: 2025-11-28) - Foundation for API development
   ```

4. **Update README statistics** (`.task-board/README.md`):
   ```markdown
   Total Plans: 20
   ├── Backlog: 18
   ├── In Progress: 0
   ├── Done: 2
   └── On Hold: 0
   ```

## Constraints and Guidelines

### Critical Constraints

1. **Never commit/push without user approval**: Always ask before running git commands
2. **Follow finans architecture patterns**: See CLAUDE.md for complete patterns
3. **Norwegian localization**: All UI text in Norwegian, use format utilities
4. **Keep PLANNING-BOARD.md lean**: Maximum 3-5 items, concise status notes
5. **Real-time updates**: Update Progress Log frequently during work
6. **One task at a time**: Limit in-progress folder to 1-2 tasks maximum
7. **No breaking changes**: Maintain backward compatibility
8. **Security first**: Never commit secrets, always validate input

### Development Environment

**Package manager**: Always use `pnpm` (not npm or yarn)

**Common commands**:
```bash
# Install dependencies
pnpm install

# Start all workspaces
pnpm dev

# Start specific workspace
pnpm --filter frontend dev
pnpm --filter backend dev

# Build all
pnpm build

# Lint all
pnpm lint

# Type-check
pnpm --filter frontend type-check
pnpm --filter backend type-check
```

**Environment files**:
- ✅ Already configured: `backend/.env` and `frontend/.env`
- ✅ Gitignored (never commit)
- OAuth credentials already set up

**CosmosDB Emulator**:
```bash
# Start emulator
.\emulator.bat

# Access emulator UI
https://localhost:8081/_explorer/
```

### Code Quality Standards

**TypeScript**:
- Strict mode enabled
- No `any` types without justification
- Explicit return types for complex functions
- Interface for object shapes

**React/Frontend**:
- Functional components only
- Custom hooks for reusable logic
- Destructure props in function signature
- Use BeerCSS classes for styling

**Express/Backend**:
- Async/await (no callbacks)
- Proper error handling (try/catch)
- Parameterized queries (prevent injection)
- Structured logging with Winston

**Imports**:
1. External packages (alphabetical)
2. Internal packages/aliases (alphabetical)
3. Relative imports (alphabetical)

### Documentation Requirements

Update docs **DURING and AFTER** work:

- **DURING**: Track implementation progress in task file Progress Log
- **AFTER**: Update Resolution section with final outcome

**Key docs to maintain**:
- Task files (Progress Log, Resolution, Verification)
- `PLANNING-BOARD.md` (current priorities and status)
- `README.md` (statistics)

## Success Criteria

A work session is complete when:

- [ ] Top priority task moved to `in-progress/`
- [ ] Implementation Plan section filled in
- [ ] `PLANNING-BOARD.md` updated with "In Progress" status
- [ ] Solution implemented following all acceptance criteria
- [ ] All builds passing (frontend, backend, TypeScript, ESLint)
- [ ] Manual testing complete
- [ ] Task file updated with Progress Log and Resolution
- [ ] Task moved to `done/`
- [ ] `PLANNING-BOARD.md` updated (item removed, added to "Recently Completed")
- [ ] README statistics updated

## Handling Edge Cases

### If PLANNING-BOARD is Empty

Ask the user:
```
The PLANNING-BOARD is currently empty. Would you like me to:
1. Add the top 3-5 numbered tasks from backlog/ (001-005)?
2. Review the entire backlog and make custom recommendations?
3. Wait for you to manually select priorities?
```

### If Top Priority is Blocked

Identify the blocker and ask:
```
The top priority (009-FEATURE-portfolio-dashboard) is blocked by:
- Requires 008-FEATURE-portfolio-api-endpoints (not complete)
- Requires 004-FEATURE-norwegian-localization (not complete)

Would you like me to:
1. Work on the blockers first (008, then 004)?
2. Skip to the next unblocked item?
3. Re-prioritize the board?
```

### If Task is Unclear

**ALWAYS ask clarifying questions** before proceeding. Examples:
- "The task mentions 'optional D3.js chart' - should I implement this for MVP or skip it?"
- "Should user profile editing work immediately or require email verification?"
- "For error messages, should they be Norwegian or English (for developers)?"
- "Should the dashboard auto-refresh data or require manual refresh?"

### If Task is Too Large

Break it down:
```
This task (009-FEATURE-portfolio-dashboard) seems too complex for a single implementation.

I recommend breaking it into:
1. 009a-FEATURE-dashboard-data-fetching.md (API integration - 1 day)
2. 009b-FEATURE-net-worth-chart.md (D3.js chart - 2 days)
3. 009c-FEATURE-account-table.md (Table component - 1 day)

Should I create these sub-tasks and start with 009a?
```

### If In-Progress Folder Has Multiple Tasks

Ask before starting new work:
```
The in-progress/ folder already has 2 tasks:
- 001-FEATURE-backend-express-server (50% complete)
- 003-FEATURE-frontend-react-initialization (25% complete)

Would you like me to:
1. Continue one of these existing tasks?
2. Move one to on-hold/ and start the new priority?
3. Finish one before starting new work?

(Recommendation: Limit work-in-progress to 1-2 tasks for focus)
```

## Integration with Other Skills

### Task-Discovery Skill

If the backlog is empty or stale:
1. Use the **task-discovery** skill to analyze gaps and generate new tasks
2. New tasks get numbered and added to `backlog/`
3. Update `PLANNING-BOARD.md` with top priorities
4. Then use this **start-working** skill to implement

### Task-Board Skill (Planning)

If the user describes a new feature during work:
1. Use the **task-board** skill to create a comprehensive plan
2. The new task gets added to `backlog/` with next available number
3. Add to `PLANNING-BOARD.md` if high priority
4. Continue with current work or switch to new priority

This skill is optimized for **implementation work** (90% of development time).

## Repository-Specific Context

### Project Structure

```
finans/
├── backend/                # Express API server
│   ├── src/
│   │   ├── config/        # Environment, CosmosDB setup
│   │   ├── routes/        # Express routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic, DB access
│   │   ├── validators/    # Input/business validation
│   │   ├── middleware/    # Auth, error handling, logging
│   │   └── utils/         # Helper functions
│   ├── .env               # Environment variables (gitignored)
│   └── package.json
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── features/      # Feature-based organization
│   │   │   ├── auth/      # Login, user management
│   │   │   ├── portfolio/ # Portfolio tracking
│   │   │   ├── calculators/ # Financial calculators
│   │   │   └── dashboard/ # Dashboard and charts
│   │   ├── shared/        # Shared code
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── hooks/     # Custom hooks
│   │   │   ├── utils/     # Utilities (Norwegian formatting)
│   │   │   └── api/       # Axios client, TanStack Query
│   │   └── stores/        # Zustand stores
│   ├── .env               # Environment variables (gitignored)
│   └── package.json
├── components/            # Shared component library
│   ├── src/               # Components + Storybook
│   └── package.json
├── e2e/                   # Playwright E2E tests (future)
├── .task-board/           # Task management system
│   ├── PLANNING-BOARD.md  # Current priorities (max 3-5)
│   ├── README.md          # System documentation
│   ├── WORKFLOW.md        # Complete workflow guide
│   ├── backlog/           # Planned tasks (001-020)
│   ├── in-progress/       # Active work (limit 1-2)
│   ├── done/              # Completed tasks
│   └── on-hold/           # Deferred tasks
├── .claude/               # Claude Code configuration
│   ├── CLAUDE.md          # Project instructions
│   └── skills/            # Custom skills
├── emulator.bat           # Start CosmosDB Emulator
└── package.json           # Root monorepo config
```

### Technology Stack

**Backend**:
- Node.js 18+ with Express
- TypeScript (strict mode)
- Azure CosmosDB (NoSQL)
- Winston (logging)
- Helmet (security)
- CORS, rate limiting

**Frontend**:
- React 18 with TypeScript
- Vite (build tool)
- BeerCSS + Material UI (styling)
- D3.js (visualizations)
- TanStack Query (server state)
- Zustand (client state)
- React Hook Form + Zod (forms)
- Axios (HTTP client)

**Tooling**:
- pnpm (package manager)
- ESLint + Prettier
- Playwright (E2E tests - future)

### Key Conventions

**Norwegian Context**:
- UI language: Norwegian (Bokmål)
- Numbers: `123 456,78 kr`
- Dates: `dd.MM.yyyy`
- Currency: NOK (kroner)

**File Naming**:
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.types.ts`

**API Endpoints**:
- Base: `/api/v1`
- REST conventions (GET, POST, PATCH, DELETE)
- Standard response format

**Git Workflow**:
- Main branch: `main`
- Conventional Commits format
- Never commit `.env` files

## See Also

- [`.task-board/WORKFLOW.md`](../../.task-board/WORKFLOW.md) - Complete task management workflow
- [`.task-board/PLANNING-BOARD.md`](../../.task-board/PLANNING-BOARD.md) - Current top priorities
- [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) - Project-wide instructions
- [`.claude/skills/task-board/SKILL.md`](../task-board/SKILL.md) - Planning skill
- [`.claude/skills/task-discovery/SKILL.md`](../task-discovery/SKILL.md) - Task discovery skill
