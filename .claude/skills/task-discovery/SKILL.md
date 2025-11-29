---
name: task-discovery
description: Autonomous task discovery agent that analyzes the finans codebase, identifies implementation gaps, and generates a comprehensive, prioritized, numbered task backlog. Delegates detailed planning to task-board skill.
---

# Task Discovery Agent

This skill provides autonomous task discovery and backlog generation for the finans project. It analyzes the codebase state, compares it against CLAUDE.md specifications, reviews existing tasks, and generates a comprehensive, numbered backlog of work items.

**CRITICAL CONSTRAINT**: This skill generates tasks autonomously but applies a strict quality bar. Only create tasks that provide clear value and are well-scoped. Delegate detailed planning to the task-board skill.

## When to Use This Skill

**Use this skill when**:
- Starting a new development phase and need to build a comprehensive backlog
- Codebase has evolved and backlog is stale or empty
- Want to discover missing features, refactors, or technical improvements
- Need to organize and prioritize existing unnumbered tasks
- Running `/discover-tasks` slash command

**DO NOT use this skill for**:
- Creating a single specific task (use task-board skill directly)
- Implementing tasks (this skill only discovers and plans)
- Quick bug fixes (just fix them directly)

## Core Principles

- **Autonomous operation**: Run until backlog is comprehensive or quality bar prevents more tasks
- **Quality over quantity**: Only create valuable, well-scoped, actionable tasks
- **Delegation pattern**: Delegate detailed planning to task-board skill for each task
- **Priority-driven numbering**: Assign sequential numbers (001, 002, ...) based on priority
- **Smart about existing work**: Enhance, merge, or renumber existing tasks rather than duplicate
- **Finans domain focus**: All tasks must align with portfolio tracking, F.I.R.E. planning, and Norwegian market

## Discovery Workflow

### Phase 1: Initial Analysis (Understanding Current State)

**Goal**: Understand what exists and what's missing

1. **Read CLAUDE.md completely**
   - Identify all described features, architecture, and requirements
   - Note technology stack and patterns
   - Understand finans domain (portfolio tracking, F.I.R.E., calculators)

2. **Analyze codebase structure**
   - Search for existing features in `/frontend/src/features/`
   - Check backend API routes in `/backend/src/routes/`
   - Review component library in `/components/src/`
   - Look for test coverage in `/e2e/`
   - Identify TODOs, FIXMEs, and code comments indicating work needed

3. **Review existing backlog**
   - Read all files in `.task-board/backlog/`
   - Read all files in `.task-board/in-progress/`
   - Read all files in `.task-board/on-hold/`
   - Identify gaps, duplicates, and vague tasks

4. **Create gap analysis**
   - Features in CLAUDE.md NOT yet implemented
   - Missing infrastructure (CI/CD, monitoring, error tracking)
   - Code quality issues (validation, error handling, testing)
   - Technical debt (deprecated patterns, TODOs)
   - Finans-specific gaps (Norwegian formatting, calculators, visualizations)

### Phase 2: Task Ideation (What Tasks Are Needed)

**Goal**: Generate list of potential tasks that meet quality bar

**Quality Bar Criteria** (ALL must be met):
- ✅ **Clear value**: Obvious user benefit OR technical necessity
- ✅ **Well-scoped**: Not too big (epic-sized), not too small (trivial)
- ✅ **Actionable**: Can be implemented without major unknowns
- ✅ **Domain-aligned**: Fits finans portfolio tracking use case
- ✅ **Non-redundant**: Not covered by existing tasks

**Analysis Areas**:

1. **Missing Features from CLAUDE.md**
   - Portfolio tracker UI
   - Financial calculators (compound, Monte Carlo)
   - Dashboard and visualizations (D3.js)
   - LLM data import interface
   - User profile management
   - Authentication flows (EasyAuth integration)

2. **Backend Infrastructure**
   - API endpoints described but not implemented
   - Database schema and containers
   - Validation layers (input + business)
   - Error handling and logging
   - Rate limiting

3. **Code Quality & Testing**
   - Missing unit tests
   - Missing E2E tests (Playwright)
   - Error boundary components
   - Input validation consolidation
   - Type safety improvements

4. **Finans-Specific Implementations**
   - Norwegian number formatting (123 456,78 kr)
   - Norwegian date formatting (dd.MM.yyyy)
   - Currency handling (NOK)
   - Asset class management
   - F.I.R.E. calculations

5. **Developer Experience**
   - CI/CD pipelines (.github/workflows/)
   - Development environment setup
   - Storybook for components
   - Documentation gaps
   - Monorepo tooling

**For Each Potential Task**:
- Apply quality bar → If fails, skip task
- Categorize as FEATURE, REFACTOR, EXPLORE, or EPIC
- Estimate complexity (Simple/Medium/Complex)
- Determine priority (High/Medium/Low)

### Phase 3: Task Planning (Delegate to task-board skill)

**Goal**: Create detailed plan files for approved tasks

**Delegation Pattern**:

1. **Invoke task-board skill** for each high-quality task idea
2. **Provide context**: "Create a plan for [task description]"
3. **Answer questions**: Task-board skill will ask clarifying questions
4. **Review output**: Ensure plan meets standards
5. **Assign metadata**: Set priority, labels, effort estimate

**Example Interaction**:
```
Discovery Agent: "We need a portfolio dashboard feature"
[Invokes task-board skill]

Task-Board Skill: "What should the dashboard display? Net worth only, or account breakdown too?"
Discovery Agent: "Both - total net worth chart and account breakdown table. High priority."

Task-Board Skill: [Creates FEATURE-portfolio-dashboard.md in backlog/]
Discovery Agent: "Approved. Assign number 003."
```

**For Each Task**:
- Ensure task-board skill creates complete plan file
- Verify all sections filled (context, acceptance criteria, technical approach)
- Confirm file paths and code references included
- Validate effort estimate is realistic

### Phase 4: Numbering & Organization

**Goal**: Assign sequential numbers and organize backlog

**Numbering Algorithm**:

1. **Collect all tasks** (new + existing)
2. **Categorize by priority**:
   - High priority tasks
   - Medium priority tasks
   - Low priority tasks
3. **Within each priority, order by**:
   - Dependencies (blocking tasks first)
   - Value (higher impact first)
   - Effort (quick wins before complex work)
4. **Assign sequential numbers**: 001, 002, 003, ...
5. **Rename files**: `TYPE-name.md` → `NNN-TYPE-name.md`
   - Example: `FEATURE-dashboard.md` → `003-FEATURE-dashboard.md`

**File Naming Format**:
- `001-FEATURE-portfolio-dashboard.md`
- `002-REFACTOR-validation-consolidation.md`
- `003-EXPLORE-langfuse-integration.md`
- `004-EPIC-fire-planning-suite.md`

**Global Sequence**: Numbers are globally sequential across all types (not per-type).

**Handling Existing Numbered Tasks**:
- If backlog already has numbered tasks, continue sequence from max number
- If renumbering entire backlog, start from 001

### Phase 5: Enhancement & Cleanup

**Goal**: Improve existing tasks and remove redundancies

**For Existing Unnumbered Tasks**:
1. Read task content
2. Assess quality (complete? clear? actionable?)
3. If vague → Enhance with better context, acceptance criteria, file paths
4. If complete → Assign number based on priority
5. Rename file with number prefix

**For Duplicate/Overlapping Tasks**:
1. Identify tasks covering same work
2. Merge into single comprehensive task
3. Keep best content from both
4. Add cross-reference in "Related Plans"
5. Delete duplicate file

**For Outdated/Irrelevant Tasks**:
1. Check if feature already implemented
2. Check if requirement changed
3. If outdated → Move to `.task-board/on-hold/` with explanation
4. If implemented → Delete (work is done)

**Final Backlog State**:
- All tasks numbered sequentially
- No duplicates
- All tasks meet quality bar
- Clear priorities
- Well-organized by type

## Quality Bar Details

### What Makes a Good Task?

**GOOD TASKS** ✅:
- "Implement portfolio dashboard with net worth chart and account table"
- "Add two-layer validation to snapshot API endpoints"
- "Create Playwright E2E test for login flow"
- "Extract shared calculator logic into utility functions"

**BAD TASKS** ❌:
- "Make the app better" (too vague)
- "Fix bug" (needs specific bug description)
- "Add all calculators" (too broad, should be multiple tasks)
- "Research everything about LLMs" (not actionable)

### When to SKIP Task Creation

**Skip if**:
- Feature is trivial (can be done in <1 hour)
- Requirements are unclear and can't be clarified
- Feature doesn't fit finans domain
- Already covered by existing task
- Speculative "nice-to-have" without clear value
- Requires major architectural decisions (create EXPLORE task instead)

### When to CREATE Task

**Create if**:
- Clear gap between CLAUDE.md and implementation
- Obvious code quality improvement
- Missing test coverage for critical flow
- Technical debt with measurable impact
- Infrastructure needed for deployment/operations

## Integration with Task-Board Skill

### Delegation Pattern

**Task Discovery** (this skill) is responsible for:
- Finding what tasks are needed
- Deciding priority and categorization
- Assigning numbers
- Organizing backlog
- Applying quality bar

**Task-Board Skill** is responsible for:
- Creating detailed plan files
- Researching codebase for context
- Defining technical approach
- Identifying dependencies and risks
- Filling complete template

### How to Delegate

```markdown
[Discovery Agent identifies need for feature]

Invoke task-board skill with:
"Create a plan for implementing [feature name].
Context: [Brief description]
Priority: [High/Medium/Low]
Target: [Frontend/Backend/Both]"

[Task-board skill asks clarifying questions]
[Discovery agent answers based on CLAUDE.md and codebase analysis]
[Task-board skill creates plan file in backlog/]
[Discovery agent assigns number and approves]
```

### Question Handling

When task-board skill asks questions, discovery agent should:
1. **Check CLAUDE.md** for specification
2. **Analyze codebase** for existing patterns
3. **Apply finans domain knowledge** (portfolio tracking, F.I.R.E.)
4. **Make informed decision** based on project context
5. **Provide clear answer** to unblock planning

## Finans-Specific Context

### Domain Knowledge

**Portfolio & Wealth Tracking**:
- Account-based tracking (not individual holdings)
- Asset classes: aksjer (stocks), fond (funds), krypto (crypto), bankkonto (bank account), custom
- Monthly snapshots with account balances
- Total net worth calculations
- F.I.R.E. planning and projections

**Financial Calculators**:
- Compound interest calculator
- Monte Carlo simulations
- Future retirement scenarios
- Loan amortization

**Norwegian Localization**:
- UI language: Norwegian (Bokmål)
- Number format: `123 456,78 kr` (space thousands, comma decimal)
- Date format: `dd.MM.yyyy`
- Currency: NOK (kroner)

### Technology Stack

**Frontend**: React 18, TypeScript, Vite, BeerCSS, D3.js, Zustand, TanStack Query
**Backend**: Node.js, Express, TypeScript, Azure App Service, EasyAuth
**Database**: Azure CosmosDB (NoSQL)
**Testing**: Playwright (E2E), Storybook (components)

### Architecture Patterns

**Frontend** (Vertical Slicing):
```
/frontend/src/features/
  /auth/           - Authentication
  /portfolio/      - Portfolio tracking
  /calculators/    - Financial calculators
  /dashboard/      - Dashboard and visualizations
```

**Backend**:
```
/backend/src/
  /routes/         - Express routes
  /controllers/    - Request handlers
  /validation/     - Input and business validation
  /services/       - Business logic
```

**State Management**:
- **Zustand**: UI preferences, local state
- **TanStack Query**: All API data
- **Context**: Auth state (EasyAuth)

## Task Categories

### FEATURE Tasks

New user-facing functionality or backend capabilities.

**Examples**:
- `001-FEATURE-portfolio-dashboard.md` - Dashboard with net worth visualization
- `002-FEATURE-compound-calculator.md` - Compound interest calculator
- `003-FEATURE-llm-data-import.md` - AI-assisted data import

**When to use**: Adding new capabilities described in CLAUDE.md

### REFACTOR Tasks

Code improvements, technical debt reduction, architecture changes.

**Examples**:
- `010-REFACTOR-validation-consolidation.md` - Unify validation patterns
- `011-REFACTOR-error-handling.md` - Improve error handling
- `012-REFACTOR-extract-calculator-logic.md` - Share calculator utilities

**When to use**: Improving code quality without changing user-facing behavior

### EXPLORE Tasks

Research, investigation, proof-of-concept work.

**Examples**:
- `020-EXPLORE-langfuse-integration.md` - LLM observability setup
- `021-EXPLORE-cosmosdb-performance.md` - Database optimization research
- `022-EXPLORE-d3-alternatives.md` - Evaluate charting libraries

**When to use**: Need research before committing to implementation approach

### EPIC Tasks

Major multi-phase features requiring multiple smaller tasks.

**Examples**:
- `030-EPIC-portfolio-tracker.md` - Complete portfolio tracking system
- `031-EPIC-fire-dashboard.md` - F.I.R.E. planning dashboard
- `032-EPIC-llm-assistant.md` - AI financial assistant

**When to use**: Large features spanning multiple sprints/weeks

## Stopping Criteria

**Continue generating tasks while**:
- Obvious gaps exist between CLAUDE.md and implementation
- Quality bar can be met for new tasks
- Backlog needs organization/numbering
- Existing tasks need enhancement

**Stop generating tasks when**:
- All major features from CLAUDE.md are covered
- No more obvious, high-value work identified
- Additional tasks would be speculative or low-value
- Quality bar prevents further task creation
- Backlog is comprehensive and well-organized

**Quality Bar Takes Precedence**: If no more tasks meet quality bar, STOP. Better to have 10 great tasks than 50 mediocre ones.

## Output Format

### Summary Report

After completion, provide summary:

```markdown
## Task Discovery Complete

**Tasks Created**: 15 new tasks
**Tasks Enhanced**: 3 existing tasks
**Tasks Merged**: 2 duplicate tasks removed
**Tasks Numbered**: 18 total tasks (001-018)

### Breakdown by Type
- FEATURE: 8 tasks (high-value user features)
- REFACTOR: 5 tasks (code quality improvements)
- EXPLORE: 2 tasks (research needed)
- EPIC: 3 tasks (large multi-phase work)

### Breakdown by Priority
- High: 6 tasks (001-006)
- Medium: 8 tasks (007-014)
- Low: 4 tasks (015-018)

### Top 5 Priorities
1. `001-FEATURE-portfolio-dashboard.md` - Core user feature
2. `002-FEATURE-user-authentication.md` - Required for launch
3. `003-REFACTOR-validation-layers.md` - Blocks feature work
4. `004-FEATURE-compound-calculator.md` - High user value
5. `005-EXPLORE-cosmosdb-setup.md` - Infrastructure dependency

### Next Steps
1. Review generated tasks in `.task-board/backlog/`
2. Add top 3-5 to PLANNING-BOARD.md
3. Start implementation with highest priority task
4. Move task to in-progress/ when starting work
```

## Limitations and Boundaries

### What This Skill Does
✅ Analyzes codebase for gaps
✅ Generates comprehensive task backlog
✅ Assigns priority-based numbering
✅ Delegates detailed planning to task-board skill
✅ Enhances existing tasks
✅ Removes duplicates
✅ Applies quality bar
✅ Organizes backlog

### What This Skill Does NOT Do
❌ Implement features or write code
❌ Modify existing code (except creating/renaming task files)
❌ Run tests or execute commands
❌ Update PLANNING-BOARD.md (user does this)
❌ Make architectural decisions (creates EXPLORE tasks instead)
❌ Create speculative or low-value tasks

## Best Practices

### Research Quality
1. **Read CLAUDE.md completely** - Don't assume, verify
2. **Search codebase thoroughly** - Multiple keywords, patterns
3. **Check existing tasks** - Avoid duplicates
4. **Understand domain** - Portfolio tracking, F.I.R.E., Norwegian context
5. **Look for patterns** - Follow existing code structure

### Task Quality
1. **Specific over vague** - "Add CompoundCalculator component" not "add calculator"
2. **Scoped appropriately** - Can be completed in days, not months
3. **Actionable** - Clear what needs to be built
4. **Valuable** - Obvious benefit to users or codebase
5. **Complete** - All template sections filled

### Numbering Quality
1. **Priority-driven** - Highest priority gets lowest numbers
2. **Dependency-aware** - Blocking tasks come first
3. **Consistent format** - Always `NNN-TYPE-description.md`
4. **Global sequence** - Don't restart numbering per type
5. **Leave gaps** - Use 001, 002, 003 (easy to insert later)

### Organization Quality
1. **No duplicates** - Merge overlapping tasks
2. **Clear categories** - Correct TYPE prefix
3. **Accurate metadata** - Priority, labels, effort estimates
4. **Cross-references** - Link related tasks
5. **Clean backlog** - Remove outdated/irrelevant tasks

## Communication Guidelines

### During Discovery

**DO**:
- Explain what you're analyzing
- Share findings as you discover gaps
- Be transparent about quality bar decisions
- Summarize at the end

**DON'T**:
- Create tasks without research
- Assume features without checking CLAUDE.md
- Duplicate existing tasks
- Create vague or speculative tasks

### When Delegating to Task-Board Skill

**DO**:
- Provide clear context for each task
- Answer questions decisively
- Review generated plans
- Assign accurate priority/effort

**DON'T**:
- Delegate without understanding the need
- Let task-board skill make priority decisions
- Accept incomplete plans
- Skip quality review

## See Also

- [`.task-board/WORKFLOW.md`](../../../.task-board/WORKFLOW.md) - Task management workflow
- [`.claude/skills/task-board/SKILL.md`](../task-board/SKILL.md) - Planning skill
- [`.claude/CLAUDE.md`](../../CLAUDE.md) - Project instructions
- [`.task-board/PLANNING-BOARD.md`](../../../.task-board/PLANNING-BOARD.md) - Current priorities
