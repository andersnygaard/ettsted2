# Task-Board Workflow

Complete workflow documentation for planning and implementing features in the finans project using a file-based task management system.

## Core Principles

1. **One plan per file** - Each feature, refactor, exploration, or epic gets its own markdown file
2. **Clear status tracking** - Status indicated by folder location (backlog → in-progress → done)
3. **Living documents** - Plans updated in real-time as work progresses
4. **Structured naming** - Consistent file naming with type prefixes
5. **Focused planning board** - Maximum 3-5 items on PLANNING-BOARD.md at any time
6. **Plan before implementing** - Research and design approach before writing code

## Folder Structure

```
.task-board/
├── WORKFLOW.md              # This file - complete workflow guide
├── PLANNING-BOARD.md        # Current top 3-5 priorities (living document)
├── README.md                # System overview and statistics
├── backlog/                 # Plans not yet started
│   ├── FEATURE-*.md         # New functionality
│   ├── REFACTOR-*.md        # Code improvements
│   ├── EXPLORE-*.md         # Research/investigation
│   └── EPIC-*.md            # Major multi-phase features
├── in-progress/             # Currently being implemented
├── done/                    # Completed plans
└── on-hold/                 # Deferred or blocked plans
```

### Folder Lifecycle

**backlog/** → Plans waiting to be started
- Created by task-board skill after research and design
- Prioritized and waiting for implementation
- Review regularly to ensure they're still relevant

**in-progress/** → Active work
- Move here when starting implementation
- Should contain very few items (ideally 1-2 max)
- Updated frequently with progress logs

**done/** → Completed work
- Move here when all acceptance criteria met and tests passing
- Retained for historical reference
- Can be reviewed to learn patterns

**on-hold/** → Temporarily blocked or deferred
- Waiting on external dependencies
- Deprioritized but not abandoned
- Document why on hold and when to revisit

## File Naming Convention

Use descriptive, kebab-case names with type prefix:

### FEATURE-[short-description].md
New functionality or capabilities for users.

**Examples**:
- `FEATURE-llm-data-import.md` - AI-assisted portfolio data import
- `FEATURE-monte-carlo-calculator.md` - Monte Carlo retirement simulation
- `FEATURE-portfolio-dashboard.md` - Portfolio overview dashboard
- `FEATURE-export-data.md` - Export user data to CSV/JSON

**When to use**: Adding new user-facing features or backend capabilities.

### REFACTOR-[short-description].md
Code improvements, technical debt reduction, architecture changes.

**Examples**:
- `REFACTOR-extract-calculator-logic.md` - Extract shared calculator utilities
- `REFACTOR-consolidate-validation.md` - Unify validation patterns
- `REFACTOR-improve-error-handling.md` - Better error handling across app
- `REFACTOR-zustand-to-tanstack.md` - Migrate state management

**When to use**: Improving code quality without changing user-facing behavior.

### EXPLORE-[short-description].md
Research, investigation, or proof-of-concept work.

**Examples**:
- `EXPLORE-langfuse-integration.md` - Investigate Langfuse for LLM observability
- `EXPLORE-cosmosdb-performance.md` - Profile and optimize database queries
- `EXPLORE-d3-chart-library.md` - Evaluate D3.js alternatives
- `EXPLORE-realtime-sync.md` - Research real-time data sync options

**When to use**: Need to research before committing to an approach.

### EPIC-[short-description].md
Major multi-phase features requiring multiple smaller plans.

**Examples**:
- `EPIC-portfolio-tracker.md` - Complete portfolio tracking system
- `EPIC-fire-dashboard.md` - F.I.R.E. planning dashboard
- `EPIC-llm-assistant.md` - AI-powered financial assistant
- `EPIC-mobile-app.md` - React Native mobile application

**When to use**: Large features that span multiple sprints/weeks and need to be broken down.

**Epic Structure**:
- Vision and goals
- Success metrics
- Phase breakdown (Phase 1, 2, 3...)
- Links to individual FEATURE plans for each phase
- Total effort estimate
- Dependencies

## PLANNING-BOARD.md Rules

The planning board is your **single source of truth** for what matters right now.

### What It Is
- Maximum **3-5 items** at any time
- Current priorities only (not a backlog)
- Living document (updated frequently)
- Actionable and specific
- Priority-ordered (top = highest)

### What It Is NOT
- ❌ Not a complete backlog (that's the backlog/ folder)
- ❌ Not a history log (remove completed items)
- ❌ Not long-term planning (focus on now/next)
- ❌ Not a wish list (must be actionable)

### When to Update

**Before starting work**:
- Review board to confirm priorities
- Add new top priority if board has space
- Re-order based on current context

**During work**:
- Mark items in-progress
- Add blocking issues if discovered
- Update daily to reflect reality

**After completing work**:
- Remove completed item from board
- Add next priority from backlog
- Update "Recently Completed" section
- Reflect on what's next

### What to Include

**DO include**:
- ✅ Next 3-5 features/refactors to work on
- ✅ Critical bugs blocking users
- ✅ Refactoring needed before new features
- ✅ Exploration work blocking decisions
- ✅ Effort estimates (Simple/Medium/Complex)
- ✅ Clear "why now" justification

**DON'T include**:
- ❌ Completed work (move to "Recently Completed")
- ❌ Detailed notes (keep in plan files)
- ❌ Long-term vision (document elsewhere)
- ❌ Nice-to-haves without clear priority

### Board Template

```markdown
# Planning Board - Finans

**Current Focus**: [E.g., "MVP Development", "Pre-Launch", "Growth Features"]

## Top Priorities

### 1. [Task Name] (Effort: Simple/Medium/Complex - X days)
**File**: `backlog/FEATURE-name.md`
**Why Now**: [Business value, user need, blocking work]
**Status**: Not Started / In Progress

### 2. [Task Name] (Effort: X days)
**File**: `backlog/REFACTOR-name.md`
**Why Now**: [Justification]
**Status**: Not Started

### 3. [Task Name] (Effort: X days)
**File**: `backlog/EXPLORE-name.md`
**Why Now**: [Justification]
**Status**: Not Started

## Recently Completed
- 2025-11-28: [Task] - [Outcome summary]
- 2025-11-25: [Task] - [Outcome summary]

## Deferred
- **[Task Name]**: [Why deferred, when to revisit]
```

## Plan File Template

Every plan file follows this structure. Fill in ALL sections.

```markdown
# [Type]: [Short Description]

**Status**: Backlog | In Progress | Done | On Hold
**Created**: YYYY-MM-DD
**Priority**: High | Medium | Low
**Labels**: frontend, backend, database, calculator, etc.
**Estimated Effort**: Simple/Medium/Complex - X days/weeks

## Context & Motivation

[Why this work is needed - business value, user need, technical debt]

## Current State

[What exists today - relevant background, current implementation]

## Desired Outcome

[What we want to achieve - specific, measurable goals]

## Acceptance Criteria

- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]
- [ ] [Tests covering the implementation]
- [ ] [Documentation updated]

## Affected Components

### Frontend (if applicable)
- **Features**: [/frontend/src/features/X/]
- **Components**: [/components/src/X]
- **State**: [Zustand store, TanStack Query hook]
- **Routes**: [New or modified routes]

### Backend (if applicable)
- **API**: [POST /api/v1/X]
- **Controllers**: [/backend/src/controllers/X]
- **Validation**: [Input/business validation]
- **Database**: [CosmosDB container: X]

### Testing
- **Unit**: [Component/logic tests]
- **E2E**: [Playwright scenarios]
- **Integration**: [API tests]

## Technical Approach

### Architecture Decisions
[Key choices and rationale]

### Implementation Steps
1. **Phase 1**: [Description]
   - Files: [List]
   - Changes: [Description]

2. **Phase 2**: [Description]
   - Files: [List]
   - Changes: [Description]

### Dependencies
- **External**: [npm packages, APIs]
- **Internal**: [Other features]
- **Blocking**: [Must complete first]

### Risks & Considerations
- **Risk**: [What could go wrong] - **Mitigation**: [How to handle]

## Code References

### Relevant Code
```typescript
// File: path/to/file.ts
[Code snippet]
```

### Similar Patterns
[Links to existing code]

## Design Notes
[UI/UX, data model, API contracts]

## Implementation Plan
[Added when moved to in-progress - detailed breakdown]

## Progress Log
[Added during work - real-time updates]
- YYYY-MM-DD HH:MM - [Update]

## Verification
[Added during work - completion checklist]
- [ ] Acceptance criteria met
- [ ] Tests passing
- [ ] Code reviewed

## Resolution
[Added when done - summary and deviations]

## Related Plans
- [Links to related/blocking plans]

---
**Next Steps**: Ready for implementation. Move to in-progress/ when starting.
```

## Workflow Checklists

### Before Starting Work

- [ ] Review PLANNING-BOARD.md
- [ ] Pick highest priority item
- [ ] Read plan file completely
- [ ] Understand acceptance criteria
- [ ] Check dependencies are ready
- [ ] Move file from backlog/ to in-progress/
- [ ] Update PLANNING-BOARD.md status to "In Progress"
- [ ] Add Implementation Plan section if needed
- [ ] Create feature branch (if using git flow)

### During Work

- [ ] Update Progress Log frequently (daily or per major step)
- [ ] Log decisions and changes
- [ ] Update PLANNING-BOARD.md if priorities shift
- [ ] Ask questions when blocked
- [ ] Document deviations from plan
- [ ] Keep in-progress/ folder minimal (1-2 items max)
- [ ] Write tests first (TDD approach)
- [ ] Commit frequently with clear messages

### After Completing Work

- [ ] Verify all acceptance criteria met
- [ ] Ensure all tests passing (unit, integration, E2E)
- [ ] Add Resolution section summarizing work
- [ ] Move file from in-progress/ to done/
- [ ] Update PLANNING-BOARD.md:
  - Remove completed item
  - Add to "Recently Completed"
  - Add next priority from backlog
- [ ] Consider follow-up work (new plans if needed)
- [ ] Celebrate! 🎉

### When Abandoning or Deferring Work

- [ ] Document why in plan file
- [ ] Move to on-hold/ or mark as won't-do
- [ ] Update PLANNING-BOARD.md
- [ ] Add to "Deferred" section with explanation
- [ ] Consider if partially-done work needs cleanup

## Using the Task-Board Skill

The task-board skill (`.claude/skills/task-board/SKILL.md`) helps create structured plans.

### When to Use the Skill

**Use for**:
- Feature requests from users
- Technical improvements you've identified
- Research needed before implementing
- Breaking down large epics

**Don't use for**:
- Quick bug fixes (just fix them)
- Simple changes (no planning needed)
- Actual implementation (skill only plans)

### How It Works

1. **User requests feature**: "I need a Monte Carlo calculator"
2. **Invoke skill**: Skill researches codebase
3. **Skill asks questions**: Clarifies scope and requirements
4. **Skill creates plan**: Writes comprehensive plan to backlog/
5. **You review and adjust**: Add to PLANNING-BOARD if priority
6. **Implement later**: When ready, move to in-progress/

### What the Skill Provides

- ✅ Researched technical approach
- ✅ Affected components identified
- ✅ Dependencies and risks mapped
- ✅ Test requirements outlined
- ✅ Effort estimate
- ✅ Complete plan file ready to implement

### What the Skill Doesn't Do

- ❌ Implement code
- ❌ Modify files (except creating plan)
- ❌ Run tests
- ❌ Update PLANNING-BOARD (you do that)

## Best Practices

### Planning
1. **Research before planning** - Understand existing code first
2. **Ask questions** - Never assume scope or requirements
3. **Break down large work** - Epics → Features → Tasks
4. **Be specific** - "Add CompoundCalculator component" not "add calculator"
5. **Document decisions** - Why, not just what

### Prioritization
1. **Keep board focused** - Max 3-5 items
2. **Order by value** - Highest impact first
3. **Consider dependencies** - Some work blocks other work
4. **Balance types** - Mix features, refactors, explorations
5. **Review regularly** - Weekly priority check

### Implementation
1. **One thing at a time** - Limit in-progress work
2. **Test-driven development** - Write tests first
3. **Update frequently** - Daily progress logs
4. **Complete before starting new** - Finish what you start
5. **Document changes** - Log deviations from plan

### File Management
1. **Descriptive names** - Clear kebab-case descriptions
2. **Consistent format** - Use template sections
3. **Keep plans updated** - Living documents
4. **Link related work** - Cross-reference plans
5. **Archive completed** - Move to done/, don't delete

## Finans-Specific Patterns

### Feature Planning
When planning features, consider:
- **Domain**: Portfolio tracking, calculators, F.I.R.E. planning
- **Norwegian**: Language, number formatting, date formatting
- **Monorepo**: Frontend/backend/components coordination
- **Auth**: EasyAuth patterns (Google/Facebook OAuth)
- **Database**: CosmosDB partitioning strategy

### Code Organization
Follow existing patterns:
- **Frontend**: Vertical slicing in `/frontend/src/features/[name]/`
- **Backend**: Routes, controllers, validation, services
- **Components**: Shared library in `/components/src/`
- **State**: Zustand (UI), TanStack Query (server), Context (auth)

### Testing
Plan tests for each layer:
- **Unit**: Component logic, utility functions, business logic
- **Integration**: API endpoints with database
- **E2E**: Critical user flows with Playwright

## Maintenance

### Weekly Review
- Review PLANNING-BOARD.md
- Check if priorities still accurate
- Clean up stale plans in backlog/
- Archive old plans from done/ if needed

### Monthly Retrospective
- Count plans (backlog/in-progress/done/on-hold)
- Review completion rate
- Identify patterns (what takes longer than estimated?)
- Update templates if needed

### Statistics to Track
- Total plans created
- Plans completed
- Average time to complete
- Success rate (completed vs abandoned)
- Most common plan types

---

## Quick Reference

**Create new plan**: Use task-board skill or manual template
**Start work**: Move backlog/ → in-progress/, update PLANNING-BOARD
**Track progress**: Update Progress Log section daily
**Complete work**: Verify criteria, move in-progress/ → done/, update board
**Defer work**: Document why, move to on-hold/

**Max in-progress**: 1-2 plans at a time
**Max planning board**: 3-5 items
**Always update**: PLANNING-BOARD.md when starting/completing work

---

See also:
- [PLANNING-BOARD.md](PLANNING-BOARD.md) - Current priorities
- [README.md](README.md) - System overview
- [.claude/skills/task-board/SKILL.md](../.claude/skills/task-board/SKILL.md) - Planning skill
- [.claude/CLAUDE.md](../.claude/CLAUDE.md) - Project instructions
