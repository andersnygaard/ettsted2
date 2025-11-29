# Task-Board Skill Usage Examples

Comprehensive examples showing how to use the task-board skill in various scenarios for the finans project.

## Table of Contents

1. [Basic Feature Planning](#basic-feature-planning)
2. [Refactoring Plan](#refactoring-plan)
3. [Exploration/Research](#explorationresearch)
4. [Epic Breakdown](#epic-breakdown)
5. [Managing the Planning Board](#managing-the-planning-board)
6. [Complete Workflow Example](#complete-workflow-example)

---

## Basic Feature Planning

### Scenario: User Requests a New Calculator

**User**: "I need to add a compound interest calculator to the app so users can estimate their investment growth."

**Your Response**:
```
I'll help you plan the compound interest calculator. Let me use the task-board skill to research the codebase and create a comprehensive plan.

[Invoke task-board skill]
```

**What the Skill Does**:

1. **Asks Clarifying Questions**:
   ```
   Questions about the compound interest calculator:

   1. What inputs should users provide?
      - Initial investment amount?
      - Monthly/annual contributions?
      - Interest rate?
      - Time period?

   2. What should the output show?
      - Final amount only?
      - Year-by-year breakdown?
      - Visualization (chart/graph)?

   3. Should results be saved to the user's portfolio?
      Or is this a one-time calculation tool?

   4. Priority level? (High/Medium/Low)
   ```

2. **User Responds**:
   ```
   1. Inputs: Initial amount, monthly contribution, annual rate, years
   2. Show final amount + chart showing growth over time
   3. Just a calculation tool - no saving needed
   4. Medium priority - nice to have for launch
   ```

3. **Skill Researches Codebase**:
   - Searches for existing calculator components
   - Checks how other features use charts (D3.js patterns)
   - Reviews form handling patterns (React Hook Form + Zod)
   - Examines Norwegian number formatting utilities

4. **Skill Creates Plan**: `.task-board/backlog/FEATURE-compound-interest-calculator.md`

   ```markdown
   # Feature: Compound Interest Calculator

   **Status**: Backlog
   **Created**: 2025-11-28
   **Priority**: Medium
   **Labels**: frontend, calculator, visualization
   **Estimated Effort**: Medium - 3 days

   ## Context & Motivation

   Users want to estimate investment growth over time using compound interest calculations. This is a common F.I.R.E. planning tool that helps users understand the power of compounding and plan their savings strategy.

   ## Current State

   No calculator features exist in the app yet. The app has:
   - Portfolio tracking (monthly snapshots)
   - Basic dashboard with net worth display
   - No financial calculation tools

   ## Desired Outcome

   A compound interest calculator that:
   - Takes user inputs (initial amount, monthly contribution, rate, years)
   - Calculates final amount using compound interest formula
   - Displays interactive D3.js chart showing growth over time
   - Uses Norwegian number formatting (123 456,78 kr)
   - Provides clear, actionable insights

   ## Acceptance Criteria

   - [ ] User can input initial investment, monthly contribution, annual rate, and years
   - [ ] Calculator displays final amount with correct compound interest calculation
   - [ ] D3.js chart shows year-by-year growth breakdown
   - [ ] All numbers formatted in Norwegian format (space thousands, comma decimal)
   - [ ] Form validation prevents invalid inputs (negative numbers, unrealistic rates)
   - [ ] Results update in real-time as user adjusts inputs
   - [ ] Responsive design works on mobile and desktop
   - [ ] Unit tests cover calculation logic
   - [ ] E2E test covers full user flow

   ## Affected Components

   ### Frontend
   - **Features**: Create `/frontend/src/features/calculators/` folder
   - **Components**:
     - `CompoundInterestCalculator.tsx` - Main calculator component
     - `CompoundInterestChart.tsx` - D3.js visualization component
     - `CalculatorForm.tsx` - Shared form component (reusable)
   - **State Management**: Zustand store for calculator inputs (no server state needed)
   - **Routes**: Add `/calculators/compound` route

   ### Backend
   - Not applicable - client-side calculation only

   ### Testing
   - **Unit Tests**:
     - `compoundInterestCalculator.test.ts` - Calculation logic
     - `CompoundInterestChart.test.tsx` - Chart rendering
   - **E2E Tests**:
     - `compound-calculator.spec.ts` - Full user flow

   ## Technical Approach

   ### Architecture Decisions

   1. **Client-side calculation**: No need for backend API - pure math formula
   2. **Zustand for state**: Simple local state, no server sync needed
   3. **Separate chart component**: Reusable for future calculators
   4. **D3.js for visualization**: Flexible, powerful, already in tech stack

   ### Implementation Steps

   1. **Phase 1: Calculator Logic & Form (Day 1)**
      - Create `/frontend/src/features/calculators/` folder
      - Create `compoundInterest.utils.ts` with calculation function
      - Create `CompoundInterestCalculator.tsx` component
      - Implement form with React Hook Form + Zod validation
      - Add Norwegian number formatting for inputs/outputs
      - Create Zustand store for calculator state

   2. **Phase 2: Visualization (Day 2)**
      - Create `CompoundInterestChart.tsx` using D3.js
      - Implement line chart showing growth over time
      - Add tooltips with Norwegian-formatted values
      - Ensure responsive design

   3. **Phase 3: Testing & Polish (Day 3)**
      - Write unit tests for calculation logic
      - Write component tests for form validation
      - Write E2E test for full user flow
      - Add route to navigation
      - Add documentation/help text

   ### Dependencies

   - **External**: None (D3.js already installed)
   - **Internal**:
     - Number formatting utility (check if exists, create if not)
     - BeerCSS form components
   - **Blocking**: None

   ### Risks & Considerations

   - **Risk**: D3.js learning curve if no existing charts
     - **Mitigation**: Start with simple line chart, reference D3 docs

   - **Risk**: Calculation accuracy with floating point
     - **Mitigation**: Use proper rounding, test with known values

   - **Risk**: Performance with many years (e.g., 50+ years)
     - **Mitigation**: Calculate on-demand, debounce inputs

   ## Code References

   ### Relevant Existing Code

   ```typescript
   // File: frontend/src/shared/utils/formatCurrency.ts (if exists)
   // Check for Norwegian number formatting utilities

   // If not, create:
   export function formatNorwegianCurrency(amount: number): string {
     return new Intl.NumberFormat('nb-NO', {
       style: 'currency',
       currency: 'NOK'
     }).format(amount);
   }
   ```

   ### Similar Patterns

   - Review `/frontend/src/features/portfolio/` for feature folder structure
   - Check for existing form patterns with React Hook Form
   - Look for Zustand store examples

   ## Design Notes

   ### UI/UX Considerations
   - Clean, simple form layout using BeerCSS grid
   - Real-time updates (no "Calculate" button needed)
   - Chart below form for immediate visual feedback
   - Help text explaining each input field
   - Example scenarios (e.g., "Saving 5000 kr/month at 7% for 20 years")

   ### Calculation Formula

   ```
   Future Value = P(1+r)^t + PMT × [((1+r)^t - 1) / r]

   Where:
   - P = Principal (initial investment)
   - r = Annual interest rate (as decimal)
   - t = Time in years
   - PMT = Periodic payment (monthly contribution × 12)
   ```

   ---

   **Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
   ```

5. **Skill Informs User**:
   ```
   ✓ Plan documented: .task-board/backlog/FEATURE-compound-interest-calculator.md

   Next steps:
   1. Review the plan to ensure it matches your vision
   2. If this is a top priority, add to PLANNING-BOARD.md
   3. When ready to implement, move to in-progress/ and start coding

   The plan includes:
   - Complete feature breakdown
   - 3-day implementation estimate
   - Client-side calculation (no backend needed)
   - D3.js chart with Norwegian formatting
   - Test coverage plan

   Would you like to adjust anything in the plan?
   ```

---

## Refactoring Plan

### Scenario: Identified Technical Debt

**You Notice**: "The validation logic is duplicated across multiple API endpoints. This should be refactored."

**Your Action**:
```
Let me use the task-board skill to create a refactoring plan for consolidating the validation logic.

[Invoke task-board skill]
```

**What the Skill Does**:

1. **Researches Current State**:
   - Searches for all validation code in backend
   - Identifies patterns and duplication
   - Checks existing validation libraries/patterns

2. **Creates Plan**: `.task-board/backlog/REFACTOR-consolidate-validation-logic.md`

   ```markdown
   # Refactor: Consolidate Validation Logic

   **Status**: Backlog
   **Created**: 2025-11-28
   **Priority**: Medium
   **Labels**: backend, refactor, technical-debt
   **Estimated Effort**: Medium - 2 days

   ## Context & Motivation

   Validation logic is currently duplicated across multiple API controllers:
   - User input validation (type, format, length)
   - Business rule validation (uniqueness, authorization)
   - Response formatting

   This duplication leads to:
   - Maintenance overhead (fix bugs in multiple places)
   - Inconsistent error messages
   - Risk of missing validation in new endpoints

   ## Current State

   Validation exists in:
   - `/backend/src/controllers/userController.ts` - Manual validation
   - `/backend/src/controllers/snapshotController.ts` - Manual validation
   - `/backend/src/controllers/accountController.ts` - Manual validation

   Each controller implements its own validation with slightly different approaches.

   ## Desired Outcome

   Centralized validation system with:
   - Reusable validation functions
   - Consistent error messages
   - Clear separation: input validation vs business validation
   - Easy to add validation to new endpoints

   ## Acceptance Criteria

   - [ ] Create `/backend/src/validation/` folder structure
   - [ ] Extract input validators (type, format, length checks)
   - [ ] Extract business validators (uniqueness, authorization)
   - [ ] All existing endpoints migrated to use new validators
   - [ ] No duplicate validation logic
   - [ ] Consistent error response format
   - [ ] Unit tests for all validators
   - [ ] Integration tests confirm endpoints still work

   ## Affected Components

   ### Backend
   - **New**: `/backend/src/validation/inputValidators.ts`
   - **New**: `/backend/src/validation/businessValidators.ts`
   - **New**: `/backend/src/validation/types.ts`
   - **Modified**: `/backend/src/controllers/userController.ts`
   - **Modified**: `/backend/src/controllers/snapshotController.ts`
   - **Modified**: `/backend/src/controllers/accountController.ts`

   ### Testing
   - **Unit Tests**: `validation.test.ts` for all validators
   - **Integration Tests**: Verify endpoints work correctly

   ## Technical Approach

   ### Architecture Decisions

   Two-layer validation (from CLAUDE.md):
   1. **Input Validators**: Field-level (type, format, length)
   2. **Business Validators**: Business logic (uniqueness, authorization)

   ### Implementation Steps

   1. **Phase 1: Create Validation Infrastructure (Day 1)**
      - Create `/backend/src/validation/` folder
      - Define validation types and interfaces
      - Create `inputValidators.ts` with common validators
      - Create `businessValidators.ts` for business rules
      - Write unit tests for validators

   2. **Phase 2: Migrate Endpoints (Day 2)**
      - Refactor `userController.ts` to use new validators
      - Refactor `snapshotController.ts` to use new validators
      - Refactor `accountController.ts` to use new validators
      - Run integration tests to confirm no regression
      - Update any endpoint-specific validation

   ### Dependencies

   - **External**: None (could consider Joi or Zod for backend later)
   - **Internal**: None
   - **Blocking**: None

   ### Risks & Considerations

   - **Risk**: Breaking existing validation behavior
     - **Mitigation**: Comprehensive tests before refactoring

   - **Risk**: Missing edge cases during migration
     - **Mitigation**: Review each controller carefully, test thoroughly

   ---

   **Next Steps**: Ready for implementation. Ensure tests are in place before starting.
   ```

---

## Exploration/Research

### Scenario: Evaluating a New Technology

**User**: "Should we use Langfuse for LLM observability? I'm not sure if it's worth the complexity."

**Your Response**:
```
Let me create an exploration plan to research Langfuse integration.

[Invoke task-board skill]
```

**What the Skill Does**:

Creates plan: `.task-board/backlog/EXPLORE-langfuse-integration.md`

```markdown
# Explore: Langfuse Integration for LLM Observability

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Low
**Labels**: backend, llm, infrastructure, research
**Estimated Effort**: Simple - 1 day

## Context & Motivation

The app will use OpenAI API for LLM-powered data import. We need to decide:
- Should we add observability/monitoring for LLM calls?
- Is Langfuse the right tool?
- What's the cost/benefit tradeoff?

## Current State

- No LLM observability in place
- OpenAI calls planned but not implemented yet
- No monitoring of LLM performance, costs, or failures

## Desired Outcome

A decision document with:
- Pros/cons of Langfuse integration
- Implementation complexity assessment
- Cost estimate (hosting, maintenance)
- Recommendation: Yes/No/Later

## Acceptance Criteria

- [ ] Research Langfuse features and pricing
- [ ] Evaluate deployment options (Azure, self-hosted)
- [ ] Estimate integration effort
- [ ] Compare alternatives (Helicone, LangSmith, custom logging)
- [ ] Document recommendation with rationale
- [ ] Present findings to user for decision

## Technical Approach

### Research Areas

1. **Langfuse Features**:
   - LLM call tracing
   - Cost tracking
   - Prompt versioning
   - User feedback collection
   - Analytics dashboard

2. **Deployment Options**:
   - Langfuse Cloud (SaaS)
   - Self-hosted on Azure App Service
   - PostgreSQL requirements
   - Cost comparison

3. **Integration Complexity**:
   - SDK integration effort
   - Environment configuration
   - Data privacy considerations
   - Maintenance overhead

4. **Alternatives**:
   - Helicone
   - LangSmith
   - Custom Winston logging
   - Azure Application Insights

### Implementation Steps

1. **Day 1: Research & Document**
   - Review Langfuse documentation
   - Test Langfuse locally with sample LLM calls
   - Estimate Azure hosting costs
   - Compare with alternatives
   - Write recommendation document
   - Present to user

### Dependencies

- **External**: None (research only)
- **Internal**: None
- **Blocking**: None (can be done anytime)

## Resolution

[To be filled after research]

**Recommendation**: [Yes/No/Later]
**Rationale**: [Explanation]
**Next Steps**: [If yes, create FEATURE plan for implementation]

---

**Next Steps**: Research and document findings. No implementation needed.
```

---

## Epic Breakdown

### Scenario: Planning a Large Feature

**User**: "I want to build a complete portfolio tracker where users can add accounts, track monthly snapshots, and visualize their net worth over time."

**Your Response**:
```
This is a large feature that should be broken down into an epic. Let me create a comprehensive plan.

[Invoke task-board skill]
```

**What the Skill Does**:

Creates epic plan: `.task-board/backlog/EPIC-portfolio-tracker.md`

```markdown
# Epic: Portfolio Tracker System

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: High
**Labels**: epic, frontend, backend, database, core-feature
**Estimated Effort**: Complex - 3-4 weeks

## Context & Motivation

Core feature of the finans app. Users need to:
- Track investments across multiple accounts
- Record monthly portfolio snapshots
- Visualize net worth growth over time
- Support multiple asset classes

This is essential MVP functionality.

## Desired Outcome

Complete portfolio tracking system where users can:
1. Create accounts (Nordnet, Bouvet ASK, etc.)
2. Add monthly snapshots with account balances
3. View historical data
4. See net worth trend visualization
5. Edit/delete past snapshots

## Success Metrics

- Users can track unlimited accounts
- Sub-second performance for displaying 5+ years of data
- Mobile-responsive design
- Zero data loss (reliable persistence)

## Epic Breakdown

### Phase 1: Backend Foundation (Week 1)

**FEATURE-portfolio-api.md**:
- API endpoints for users, snapshots, accounts
- CosmosDB containers and queries
- Validation (input + business)
- Unit and integration tests

**Effort**: 5 days
**Priority**: High (blocking)

### Phase 2: Basic UI (Week 2)

**FEATURE-portfolio-form.md**:
- Add snapshot form
- Account management UI
- Basic table view of snapshots
- Norwegian number formatting

**Effort**: 5 days
**Dependencies**: Phase 1

### Phase 3: Visualization (Week 3)

**FEATURE-networth-chart.md**:
- D3.js line chart showing net worth over time
- Interactive tooltips
- Responsive design
- Asset allocation breakdown (optional)

**Effort**: 4 days
**Dependencies**: Phase 2

### Phase 4: Polish & Features (Week 4)

**FEATURE-edit-snapshots.md**:
- Edit historical snapshots
- Delete snapshots with confirmation
- Bulk import (optional)

**Effort**: 3 days
**Dependencies**: Phase 3

**FEATURE-portfolio-dashboard.md**:
- Dashboard summary view
- Quick add snapshot
- Recent changes widget

**Effort**: 2 days
**Dependencies**: Phase 3

## Affected Components

### Frontend
- `/frontend/src/features/portfolio/` - New feature folder
- `/components/src/` - Reusable form components
- Zustand store for portfolio UI state
- TanStack Query for API data

### Backend
- `/backend/src/routes/snapshots.ts`
- `/backend/src/routes/accounts.ts`
- `/backend/src/controllers/`
- `/backend/src/validation/`

### Database
- CosmosDB container: `portfolios` (partition: userId)
- Document structure for snapshots

### Testing
- E2E tests for complete user flow
- Unit tests for calculations
- Integration tests for API

## Technical Risks

- **Risk**: CosmosDB query performance with large datasets
  - **Mitigation**: Pagination, indexing strategy

- **Risk**: D3.js learning curve
  - **Mitigation**: Start simple, iterate

- **Risk**: Complex state management
  - **Mitigation**: Clear separation (Zustand UI, TanStack Query server)

## Implementation Strategy

1. **Sequential phases** - Don't start Phase 2 until Phase 1 done
2. **Test-driven** - Write tests first for each phase
3. **User feedback** - Get feedback after Phase 2 before continuing
4. **Incremental delivery** - Each phase is potentially shippable

## Related Plans

- Link to individual phase plans when created
- Link to related calculators (monte-carlo, compound-interest)

---

**Next Steps**:
1. Create individual FEATURE plans for each phase
2. Start with Phase 1: `FEATURE-portfolio-api.md`
3. Add Phase 1 to PLANNING-BOARD.md as top priority
```

---

## Managing the Planning Board

### Example: Updating PLANNING-BOARD.md

**Initial State** (empty board):
```markdown
# Planning Board - Finans

**Current Focus**: MVP Development

## Top Priorities

**No priorities set yet.**
```

**After Creating Plans**:

You've created:
- `FEATURE-compound-interest-calculator.md`
- `REFACTOR-consolidate-validation.md`
- `FEATURE-portfolio-api.md` (Phase 1 of epic)

**Updated Board**:
```markdown
# Planning Board - Finans

**Current Focus**: MVP Development - Core Portfolio Features

## Top Priorities

### 1. Portfolio API Backend (Effort: Complex - 5 days)
**File**: `backlog/FEATURE-portfolio-api.md`
**Why Now**: Blocking all other portfolio features. Core MVP functionality.
**Status**: Not Started

### 2. Compound Interest Calculator (Effort: Medium - 3 days)
**File**: `backlog/FEATURE-compound-interest-calculator.md`
**Why Now**: Quick win for MVP, demonstrates calculator value proposition.
**Status**: Not Started

### 3. Consolidate Validation Logic (Effort: Medium - 2 days)
**File**: `backlog/REFACTOR-consolidate-validation.md`
**Why Now**: Reduces technical debt before adding more endpoints.
**Status**: Not Started

## Recently Completed

*No completed items yet.*

## Deferred

*No deferred items yet.*

---

**Last Updated**: 2025-11-28
```

**During Implementation**:

```markdown
### 1. Portfolio API Backend (Effort: Complex - 5 days)
**File**: `in-progress/FEATURE-portfolio-api.md`
**Why Now**: Blocking all other portfolio features. Core MVP functionality.
**Status**: In Progress (Day 2/5)
```

**After Completion**:

Move file to `done/`, update board:

```markdown
# Planning Board - Finans

**Current Focus**: MVP Development - Core Portfolio Features

## Top Priorities

### 1. Compound Interest Calculator (Effort: Medium - 3 days)
**File**: `backlog/FEATURE-compound-interest-calculator.md`
**Why Now**: Quick win for MVP, demonstrates calculator value proposition.
**Status**: Not Started

### 2. Portfolio Form UI (Effort: Medium - 5 days)
**File**: `backlog/FEATURE-portfolio-form.md`
**Why Now**: Unblocked by completed API. Core MVP functionality.
**Status**: Not Started

### 3. Consolidate Validation Logic (Effort: Medium - 2 days)
**File**: `backlog/REFACTOR-consolidate-validation.md`
**Why Now**: Reduces technical debt before adding more endpoints.
**Status**: Not Started

## Recently Completed

- 2025-11-30: Portfolio API Backend - API endpoints, validation, tests all passing

---

**Last Updated**: 2025-11-30
```

---

## Complete Workflow Example

### End-to-End: Feature Request → Planning → Implementation → Completion

#### Step 1: User Request

**User**: "Users need to export their portfolio data to CSV for tax reporting."

#### Step 2: Create Plan

**You**: "I'll create a plan for the export feature."

[Invoke task-board skill]

**Skill creates**: `.task-board/backlog/FEATURE-export-portfolio-csv.md`

#### Step 3: Review & Prioritize

**You**: "Plan created. This is medium priority - not critical for MVP but valuable for users."

**Action**: Add to PLANNING-BOARD.md at position #4

#### Step 4: Start Implementation

When ready to implement:

1. **Move file**: `backlog/FEATURE-export-portfolio-csv.md` → `in-progress/`

2. **Update PLANNING-BOARD.md**:
   ```markdown
   ### 2. Export Portfolio to CSV (Effort: Simple - 1 day)
   **File**: `in-progress/FEATURE-export-portfolio-csv.md`
   **Why Now**: User requested for tax reporting.
   **Status**: In Progress
   ```

3. **Add Implementation Plan section** to plan file:
   ```markdown
   ## Implementation Plan

   ### Backend Changes
   1. Create `/backend/src/utils/csvExport.ts` utility
   2. Add `GET /api/v1/export/portfolio` endpoint
   3. Format snapshots as CSV with Norwegian date format
   4. Add appropriate headers for download

   ### Frontend Changes
   1. Add "Export CSV" button to portfolio page
   2. Call export API endpoint
   3. Trigger download in browser

   ### Testing
   1. Unit test CSV formatting
   2. E2E test download functionality
   ```

#### Step 5: Track Progress

Update Progress Log as you work:

```markdown
## Progress Log

- 2025-12-01 10:00 - Created CSV export utility with tests
- 2025-12-01 12:00 - Added backend endpoint, tested with Postman
- 2025-12-01 14:00 - Implemented frontend button and download logic
- 2025-12-01 15:30 - E2E test passing, all unit tests green
```

#### Step 6: Verify & Complete

1. **Verify acceptance criteria**:
   ```markdown
   ## Verification

   - [x] CSV export contains all snapshot data
   - [x] Dates formatted as dd.MM.yyyy
   - [x] Numbers formatted with Norwegian convention
   - [x] Download triggers correctly in browser
   - [x] Unit tests passing (100% coverage)
   - [x] E2E test passing
   ```

2. **Add resolution**:
   ```markdown
   ## Resolution

   Implemented CSV export functionality with:
   - Backend utility for CSV generation
   - API endpoint for download
   - Frontend button on portfolio page
   - Full test coverage

   No deviations from plan. Completed in 1 day as estimated.
   ```

3. **Move file**: `in-progress/FEATURE-export-portfolio-csv.md` → `done/`

4. **Update PLANNING-BOARD.md**:
   ```markdown
   ## Recently Completed

   - 2025-12-01: Export Portfolio to CSV - Users can download CSV for tax reporting
   ```

5. **Add next priority** from backlog to fill the spot

---

## Summary

The task-board skill:
- ✅ Creates structured, comprehensive plans
- ✅ Researches codebase before planning
- ✅ Asks clarifying questions
- ✅ Documents technical approach and risks
- ✅ Integrates with plan mode workflow
- ✅ Stores plans in git-tracked markdown files

This enables:
- Better planning and estimation
- Clear communication of technical approach
- Historical record of decisions
- Focused implementation (one plan at a time)
- Continuous learning from completed work

For more details, see:
- [.task-board/WORKFLOW.md](../.task-board/WORKFLOW.md)
- [.task-board/README.md](../.task-board/README.md)
- [.claude/skills/task-board/SKILL.md](../.claude/skills/task-board/SKILL.md)
