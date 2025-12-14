---
description: Understand completed task in broader context than during implementation
---

# Review Task

Review a COMPLETED task (already in done/) to understand how the implementation fits in a broader context than you had when implementing.

**This is a learning tool, not a gate.**

## When to Use

- Task is DONE and in `.task-board/done/`
- Want to understand broader impact of changes
- See how implementation connects to other parts of codebase
- Learn patterns for future similar work

## Workflow

### Step 1: Load Task

```
/review-task 150
```

1. **Find task file** in `.task-board/done/`
2. **Read what was implemented**
3. **Identify files that were changed**

### Step 2: Expand Context (Narrow→Broader)

Go WIDER than during implementation:

```
What you changed (narrow - you know this)
       ↓
What consumes this code (who uses it?)
       ↓
Related features (siblings, alternatives)
       ↓
Architectural patterns (how does this fit?)
       ↓
Similar implementations elsewhere (learn from others)
```

### Step 3: Build Understanding

**Questions to answer:**
- How do OTHER parts of the codebase use this?
- Are there similar patterns elsewhere I should know about?
- Did this change affect anything unexpected?
- What could I have done differently knowing more context?

### Step 4: Report Learnings

```
## Review: {task-id}

**What was implemented**:
- Brief summary

**Broader context discovered**:
- [consumer1.tsx](path) uses this for...
- Similar pattern exists in [other.tsx](path)
- This connects to feature X via...

**Learnings**:
- Pattern I discovered: ...
- Could improve: ...
- Related work to consider: ...

**Follow-up tasks** (if any):
- Potential improvement: ...
- Related refactor: ...
```

## Example

```
/review-task 150-FEATURE-chart-animations
```

1. Read task: Added entry animations to charts
2. What was changed: D3 transition code in LineChart
3. Expand: Who uses LineChart? → Dashboard, Portfolio, Gjeld pages
4. Broader: Are there other charts? → Yes, StackedAreaChart, does it have animations?
5. Learn: Animation pattern could be shared across all charts

## See Also

- `/new-task` - Plan ONE new task (narrow→broad, uses `feature-planning` skill)
- `/discover-tasks` - Bulk backlog scan (broad→narrow, uses `backlog-scan` skill)
