---
name: issue-reporting
description: Advanced issue reporter that analyzes codebases, identifies root causes, and creates comprehensive issue documentation. Use this skill when users report bugs, request features, or identify technical debt. This skill investigates and documents without implementing fixes.
---

# Issue Reporting Skill

ALL BACKLOG TICKETS ARE INITIALLY WRITTEN TO /issue-tracking/backlog

ALL BACKLOG TICKERS ARE WRITTEN IN ENGLISH

This skill provides specialized workflows for investigating and documenting bugs, features, refactors, and technical debt in the retrospective.fun codebase. It transforms user reports into comprehensive, well-researched issue files that are ready for implementation.

**CRITICAL CONSTRAINT**: This skill is for investigation and documentation ONLY. Never implement fixes, write code changes, or modify the codebase. The sole responsibility is creating thorough issue documentation in `issue-tracking/backlog/`.

## When to Use This Skill

**Use this skill for**:
- Bug reports requiring root cause analysis
- Feature requests needing technical context
- Refactoring ideas requiring impact assessment
- Technical debt identification and documentation
- User-reported issues that need clarification and research

**DO NOT use this skill for**:
- Implementing fixes or features (that's a separate workflow)
- Major architectural planning requiring comprehensive multi-phase plans
- Direct code changes or refactoring
- Test writing or execution

## Core Investigation Principles

- **Research before documenting**: Thoroughly investigate the codebase before creating issue files
- **Ask clarifying questions**: Never assume—gather complete information from users
- **Root cause identification**: Find the specific code, architecture, or design causing the issue
- **Comprehensive context**: Include file paths, line numbers, code snippets, and system details
- **Impact assessment**: Identify affected components, dependencies, and potential side effects
- **Test coverage analysis**: Document existing test coverage and gaps
- **No implementation**: Focus solely on understanding and documentation

## Investigation Workflow

### Phase 1: Initial Understanding (Gather Context)

1. **Listen carefully**: Read the user's report completely
2. **Ask clarifying questions** if anything is unclear:
   - What were you trying to do?
   - What did you expect to happen?
   - What actually happened?
   - Can you reproduce it? How?
   - When did this start happening?
   - Are there error messages or logs?
3. **Identify issue type**: Bug, feature, refactor, technical debt, or exploration
4. **Assess priority**: Critical (production blocking), high, medium, or low

### Phase 2: Codebase Investigation (Deep Analysis)

**CRITICAL**: Conduct thorough research before creating the issue file.

1. **Search for relevant code**:
   - Use search tools to find keywords, function names, component names
   - Look for error messages, class names, or API endpoints mentioned by user
   - Check related files in the same directory or module

2. **Read relevant files**:
   - Examine suspected problem areas
   - Review related components and dependencies
   - Check test files for existing coverage
   - Look at recent changes in git history if relevant

3. **Identify root cause**:
   - Pinpoint the specific code location (file:line)
   - Understand why the issue exists (design flaw, bug, missing feature)
   - Identify contributing factors or edge cases

4. **Map impact**:
   - Which components are affected?
   - What dependencies exist?
   - Are there similar issues elsewhere?
   - What tests exist or are missing?

5. **Check architecture patterns**:
   - For frontend: Is this a component, store, service, or routing issue?
   - For backend: Is this in controllers, handlers, domain logic, or events?
   - Does it follow CQRS/event sourcing patterns correctly?

### Phase 3: Documentation (Create Issue)

Create a comprehensive issue file in `issue-tracking/backlog/` with:

1. **Descriptive filename** following conventions:
   - `BUG-[short-description].md`
   - `FEATURE-[short-description].md`
   - `REFACTOR-[short-description].md`
   - `EXPLORE-[short-description].md`

2. **Complete template** with all sections filled (see template below)

3. **Specific technical details**:
   - File paths with line numbers: `server/Domain/SessionContent/SessionContentCommandHandler.cs:142`
   - Code snippets showing the problematic area
   - Error messages or stack traces
   - Reproduction steps with specific values
   - Architecture context (CQRS events, SignalR hubs, NgRx stores, etc.)

### Phase 4: Validation (Confirm Completeness)

Before finishing, verify:
- [ ] User's report is fully understood
- [ ] All clarifying questions answered
- [ ] Root cause identified or hypothesis documented
- [ ] Specific file locations and line numbers included
- [ ] Impact and dependencies mapped
- [ ] Test coverage assessed
- [ ] Priority and labels set appropriately
- [ ] Issue file created in `backlog/` folder
- [ ] User informed that issue is ready for implementation

## File Naming Convention

Use descriptive, kebab-case names with type prefix:

- **Bugs**: `BUG-[short-description].md`
  - Example: `BUG-timer-not-pausing.md`
  - Example: `BUG-voting-results-incorrect.md`

- **Features**: `FEATURE-[short-description].md`
  - Example: `FEATURE-anonymous-voting.md`
  - Example: `FEATURE-export-session-results.md`

- **Refactors**: `REFACTOR-[short-description].md`
  - Example: `REFACTOR-simplify-auth-flow.md`
  - Example: `REFACTOR-extract-timer-logic.md`

- **Explorations**: `EXPLORE-[short-description].md`
  - Example: `EXPLORE-replace-mongodb-with-cosmosdb.md`
  - Example: `EXPLORE-migrate-to-shared-components.md`

## Repository-Specific Context

This is a **retrospective.fun** project with specific architecture patterns to understand:

### Backend (.NET / CQRSLite)
- **CQRS pattern**: Commands/queries separated, event-driven
- **No direct SignalR calls from controllers**: Use domain events and event handlers
- **Key namespaces**: `Server.Domain`, `Server.Controllers`, `Server.Events`
- **Test location**: `Server.Tests/`

### Frontend (Angular 20 / NgRx SignalStore)
- **Component responsibility**: UI only, no business logic
- **SignalStore pattern**: All state management, API calls, and side effects
- **New control flow**: Use `@if`, `@for` (not `*ngIf`, `*ngFor`)
- **Codegen types**: Prefer `@codegen` types from Firebase schema
- **Test location**: `*.spec.ts` files alongside components

### Common Investigation Patterns

**For bugs**:
1. Check if issue is frontend (component/store) or backend (controller/handler)
2. Search for error messages in codebase
3. Look for recent git commits in affected area
4. Check if tests exist and are passing
5. Verify architecture patterns are followed

**For features**:
1. Find similar existing features
2. Identify where new code should live (component vs store vs handler)
3. Check if existing architecture supports it
4. Look for gaps in current implementation
5. Identify test requirements

**For refactors**:
1. Find all usages of code to be refactored
2. Identify dependencies and coupling
3. Check test coverage
4. Assess risk and impact
5. Look for similar patterns elsewhere

## Enhanced Issue Template

Use this comprehensive template for all issue files. Fill in ALL sections based on investigation:

```markdown
# [Type]: [Short Description]

**Status**: Backlog
**Created**: [YYYY-MM-DD]
**Priority**: [Critical/High/Medium/Low]
**Labels**: [comma, separated, labels]
**Reporter**: [User or agent name]

## Problem Statement

[Clear, specific description of the bug, feature need, or refactor opportunity]

[For bugs: What is broken? What is the user impact?]
[For features: What capability is missing? Why is it needed?]
[For refactors: What technical debt or design issue exists?]

## User Report

[Original user description, reproduction steps, or feature request]
[Include any error messages, screenshots, or context provided by user]

## Acceptance Criteria

- [ ] [Specific, measurable criterion 1]
- [ ] [Specific, measurable criterion 2]
- [ ] [Specific, measurable criterion 3]
- [ ] [Tests covering the fix/feature]
- [ ] [Documentation updated]

## Root Cause Analysis

**Hypothesis**: [Your analysis of what is causing the issue]

**Evidence**:
- [Observation 1 with file:line reference]
- [Observation 2 with code snippet]
- [Observation 3 with architecture context]

**Confidence Level**: [High/Medium/Low] - [Explanation]

## Affected Components

### Frontend (if applicable)
- **Components**: [List with paths, e.g., `src/app/session/timer.component.ts:42`]
- **Stores**: [SignalStore files affected]
- **Services**: [Service files affected]
- **Routes**: [Routing impacts]

### Backend (if applicable)
- **Controllers**: [Controller files, e.g., `server/Controllers/SessionController.cs:156`]
- **Domain Handlers**: [Command/query handlers]
- **Events**: [Event handlers or publishers]
- **Models**: [Domain models or aggregates]

### Database/Schema (if applicable)
- **Collections**: [Firebase collections affected]
- **Schema Changes**: [Any schema modifications needed]

## Code References

### Primary Location
```[language]
// File: [path/to/file.ext:line]
[Relevant code snippet showing the issue or area to modify]
```

### Related Locations
```[language]
// File: [path/to/related/file.ext:line]
[Related code that may need changes or provides context]
```

## Test Coverage

### Existing Tests
- **Unit Tests**: [List test files covering this area]
  - [ ] `[test-file.spec.ts]` - [Coverage description]
- **E2E Tests**: [List E2E scenarios]
  - [ ] `[e2e-test.spec.ts]` - [Coverage description]
- **Backend Tests**: [List .NET tests]
  - [ ] `[TestClass.cs]` - [Coverage description]

### Test Gaps
- [ ] [Missing test scenario 1]
- [ ] [Missing test scenario 2]
- [ ] [Missing edge case tests]

## Architecture Context

**Design Patterns Involved**:
- [CQRS, event sourcing, SignalStore, etc.]
- [Specific pattern application or violation]

**Dependencies**:
- [External libraries or services involved]
- [Internal dependencies and coupling]

**Side Effects**:
- [Potential impact on other features]
- [Breaking changes or migration needs]

## Reproduction Steps

For bugs, provide exact steps:
1. [Step 1 with specific values]
2. [Step 2 with specific actions]
3. [Step 3 showing expected vs actual]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]
**Frequency**: [Always/Sometimes/Rare - conditions]

## Investigation Notes

[Document your research process and findings]

**Files Examined**:
- [file1.ts] - [Finding]
- [file2.cs] - [Finding]
- [file3.spec.ts] - [Finding]

**Git History**:
- [Recent relevant commits, if any]

**Similar Issues**:
- [Link to related bugs or patterns found]

## Proposed Solution Direction

[High-level approach to fix/implement - NOT detailed implementation]

**Strategy**: [Brief description of approach]

**Considerations**:
- [Trade-off 1]
- [Risk 1]
- [Alternative approach]

**Estimated Complexity**: [Simple/Moderate/Complex]

## Related Issues

- [Link to related issue 1]
- [Link to related issue 2]
- [Link to blocking issue]

## Additional Context

[Any other relevant information: browser versions, environment details, configuration, etc.]

---

**Next Steps**: Ready for implementation by development team. See `issue-tracking/AGENTS.md` for workflow.
```

## Best Practices

### Research Quality
1. **Thorough investigation**: Use multiple search strategies (keywords, file patterns, related terms)
2. **Read, don't skim**: Actually open and read files—don't just list search results
3. **Follow the trail**: If you find one file, look for imports, usages, and related files
4. **Check git history**: Recent commits can reveal patterns or related changes
5. **Multiple perspectives**: Look at frontend, backend, tests, and documentation

### Question Quality
1. **Ask specific questions**: Instead of "Tell me more", ask "Does this happen with all timers or specific ones?"
2. **Confirm hypotheses**: "I think this might be X. Can you verify by doing Y?"
3. **One question at a time**: Don't overwhelm users with 10 questions at once
4. **Progressive refinement**: Start broad, get specific as you learn more

### Documentation Quality
1. **Be specific**: Replace "timer code" with "src/app/session/timer.component.ts:87"
2. **Include evidence**: Don't just say "code is wrong"—show the problematic code snippet
3. **Quantify impact**: "Affects all 500+ active sessions" vs "affects users"
4. **State confidence**: Be honest about certainty ("High confidence" vs "Hypothesis - needs verification")
5. **Link everything**: Cross-reference related files, issues, and documentation

### Completeness Checklist

Before creating an issue file, verify:
- [ ] **User's intent is clear** - Asked clarifying questions if needed
- [ ] **Root cause identified** - Or hypothesis documented with evidence
- [ ] **Specific file locations** - Not just "the timer code" but exact paths
- [ ] **Line numbers included** - Pinpoint exact locations when possible
- [ ] **Code snippets provided** - Show the relevant code, don't just describe it
- [ ] **Test coverage assessed** - Listed existing tests and gaps
- [ ] **Architecture context** - Explained which patterns/layers are involved
- [ ] **Impact evaluated** - Listed affected components and dependencies
- [ ] **Priority justified** - Explained why critical/high/medium/low
- [ ] **Reproduction steps** - For bugs, provided exact steps with expected vs actual
- [ ] **Solution direction** - High-level approach (not detailed implementation)
- [ ] **All template sections filled** - No [TODO] or empty sections

## Communication Guidelines

### When User Reports an Issue

**DO**:
- Thank them for the report
- Ask clarifying questions immediately
- Explain what you're investigating
- Share findings as you discover them
- Admit when you're uncertain
- Provide confidence levels with evidence

**DON'T**:
- Jump to conclusions without investigation
- Assume you understand without asking
- Promise fixes (you don't implement)
- Blame the user or their setup
- Use jargon without explanation
- Create the issue prematurely

## Limitations and Boundaries

### What This Skill Does
✅ Investigates and documents issues
✅ Identifies root causes and hypotheses
✅ Searches codebase and reads files
✅ Maps affected components
✅ Assesses test coverage
✅ Creates comprehensive issue files
✅ Asks clarifying questions

### What This Skill Does NOT Do
❌ Implement fixes or write code
❌ Modify existing files
❌ Run tests or execute commands
❌ Create pull requests
❌ Update PLANNING-BOARD.md (that happens during implementation)
❌ Move issues between folders (stays in backlog)
❌ Write detailed implementation plans (that's for the implementation workflow)

## Handoff to Implementation

After creating an issue file, inform the user:

```
✓ Issue documented: issue-tracking/backlog/[ISSUE-NAME].md

Next steps:
1. Review the issue file to ensure accuracy
2. If ready, the issue can be moved to in-progress for implementation
3. The implementation team will add detailed implementation plan
4. They'll follow TDD approach: write tests, fix implementation, verify all passing

Would you like me to clarify anything in the issue documentation?
```

## Integration with Workflow

This skill creates issues in `backlog/` folder. The implementation workflow then:
1. Moves file to `in-progress/`
2. Adds detailed implementation plan
3. Updates PLANNING-BOARD.md
4. Implements following TDD approach
5. Moves to `done/` when complete

## See Also

- [`issue-tracking/AGENTS.md`](../../issue-tracking/AGENTS.md) - Complete workflow documentation
- [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) - Project-wide instructions
