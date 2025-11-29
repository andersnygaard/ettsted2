# Task-Board System

File-based task management and planning system for the finans project.

## Overview

The task-board system provides a structured approach to planning and tracking implementation work using markdown files organized into folders. It integrates with Claude Code's plan mode to create comprehensive, well-researched plans before implementation.

**Purpose**:
- Transform user requests into structured implementation plans
- Track progress through file-based workflow
- Maintain focus on current priorities (max 3-5 items)
- Document architecture decisions and technical approaches
- Create a historical record of completed work

## Quick Start

### 1. Creating a Plan

**Option A: Use the task-board skill**
```
User: "I need to add a Monte Carlo calculator to the app"
Claude: [Invokes task-board skill]
        [Researches codebase]
        [Asks clarifying questions]
        [Creates plan in .task-board/backlog/FEATURE-monte-carlo-calculator.md]
```

**Option B: Create manually**
1. Copy template from [WORKFLOW.md](WORKFLOW.md)
2. Create new file in `backlog/` folder
3. Fill in all sections with research and design
4. Use naming convention: `TYPE-short-description.md`

### 2. Starting Work

1. Review [PLANNING-BOARD.md](PLANNING-BOARD.md)
2. Pick highest priority plan
3. Move file from `backlog/` to `in-progress/`
4. Update PLANNING-BOARD.md status to "In Progress"
5. Add Implementation Plan section if needed
6. Begin implementation

### 3. During Work

- Update Progress Log section daily
- Log decisions and changes as you go
- Keep PLANNING-BOARD.md current
- Limit in-progress work (1-2 items max)

### 4. Completing Work

1. Verify all acceptance criteria met
2. Ensure all tests passing
3. Add Resolution section
4. Move file from `in-progress/` to `done/`
5. Update PLANNING-BOARD.md:
   - Remove completed item
   - Add to "Recently Completed"
   - Add next priority

## Folder Structure

```
.task-board/
├── WORKFLOW.md              # Complete workflow documentation
├── PLANNING-BOARD.md        # Current top 3-5 priorities
├── README.md                # This file
├── backlog/                 # Plans not yet started
├── in-progress/             # Currently being implemented
├── done/                    # Completed plans
└── on-hold/                 # Deferred plans
```

### Status Tracking

Plans move through folders to indicate status:
- **backlog/** - Planned but not started
- **in-progress/** - Actively being implemented (keep minimal)
- **done/** - Completed and verified
- **on-hold/** - Temporarily blocked or deferred

## File Types

| Type | Purpose | Example |
|------|---------|---------|
| **FEATURE-** | New functionality | `FEATURE-llm-data-import.md` |
| **REFACTOR-** | Code improvements | `REFACTOR-extract-calculator-logic.md` |
| **EXPLORE-** | Research/investigation | `EXPLORE-langfuse-integration.md` |
| **EPIC-** | Multi-phase features | `EPIC-portfolio-tracker.md` |

See [WORKFLOW.md](WORKFLOW.md) for detailed naming conventions and when to use each type.

## Statistics

```
Total Plans: 62
├── Backlog: 50
├── In Progress: 0
├── Done: 9
└── On Hold: 3
```

*Last updated: 2025-11-29*

## Current Focus

See [PLANNING-BOARD.md](PLANNING-BOARD.md) for the current top 3-5 priorities.

**Current Phase**: Initial Setup & MVP Development

## Key Workflows

### Planning New Work

1. User describes what they need
2. Use task-board skill to research and create plan
3. Skill creates file in `backlog/`
4. Review plan for completeness
5. Add to PLANNING-BOARD.md if it's a priority

### Managing Priorities

1. Keep PLANNING-BOARD.md focused (max 3-5 items)
2. Order by business value and dependencies
3. Update daily as work progresses
4. Remove completed items promptly
5. Review weekly to ensure alignment

### Completing Work

1. Verify all acceptance criteria
2. Ensure tests passing (unit/integration/E2E)
3. Document what was implemented
4. Move plan to done/ folder
5. Update PLANNING-BOARD.md
6. Consider follow-up work

## Best Practices

✅ **DO**:
- Research thoroughly before creating plans
- Keep plans specific and actionable
- Update progress logs frequently
- Limit in-progress work (1-2 max)
- Complete work before starting new
- Keep PLANNING-BOARD.md current

❌ **DON'T**:
- Skip research phase
- Create vague or unclear plans
- Let plans go stale without updates
- Start too much work at once
- Abandon plans without documentation
- Let planning board grow beyond 5 items

## Integration with Claude Code

This system integrates with Claude Code's planning features:

1. **Plan Mode**: Use Claude's plan mode to design approaches
2. **Task-Board Skill**: Skill creates structured plan files
3. **File Organization**: Plans stored in git-tracked folders
4. **Progress Tracking**: Update files as implementation progresses
5. **Historical Record**: Completed plans retained for reference

## Plan File Template

Every plan includes:
- **Context & Motivation** - Why this work is needed
- **Current State** - What exists today
- **Desired Outcome** - What success looks like
- **Acceptance Criteria** - Specific, testable requirements
- **Affected Components** - Frontend/Backend/Database impacts
- **Technical Approach** - Architecture decisions and implementation steps
- **Dependencies** - External/internal/blocking items
- **Risks** - What could go wrong and mitigations
- **Code References** - Relevant existing code
- **Progress Tracking** - Implementation plan, logs, verification

See [WORKFLOW.md](WORKFLOW.md) for complete template.

## Finans-Specific Context

Plans should consider:
- **Domain**: Portfolio tracking, F.I.R.E. planning, financial calculators
- **Norwegian**: Language, number formatting (123 456,78 kr), dates (dd.MM.yyyy)
- **Tech Stack**: React, Express, CosmosDB, BeerCSS, D3.js
- **Monorepo**: Frontend/backend/components coordination
- **Testing**: Playwright E2E, component tests, API tests

## Resources

- [WORKFLOW.md](WORKFLOW.md) - Complete workflow guide
- [PLANNING-BOARD.md](PLANNING-BOARD.md) - Current priorities
- [.claude/skills/task-board/SKILL.md](../.claude/skills/task-board/SKILL.md) - Planning skill
- [.claude/CLAUDE.md](../.claude/CLAUDE.md) - Project instructions
- [.docs/task-board-examples.md](../.docs/task-board-examples.md) - Usage examples

## Maintenance

### Weekly
- Review PLANNING-BOARD.md for accuracy
- Clean up stale plans in backlog/
- Update statistics in this file

### Monthly
- Review completion rate
- Identify patterns (effort estimates, completion time)
- Update templates based on learnings
- Archive old completed plans if needed

---

**Questions?** See [WORKFLOW.md](WORKFLOW.md) for detailed documentation.
