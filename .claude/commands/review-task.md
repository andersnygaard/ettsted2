---
description: Review a backlog task to verify if it's still valid and reproducible
---

Review task **$ARGUMENTS** from the backlog.

## Instructions

1. **Read the task file** from `.task-board/backlog/{task-id}-*.md`

2. **Determine task type** and apply appropriate review:

### For BUG tasks:
- Reproduce the bug by inspecting the relevant code
- If UI-related: use Playwright to navigate and take screenshots
- Check if the issue still exists in current codebase
- Verify the described behavior matches actual behavior
- Test edge cases mentioned in the task

### For FEATURE tasks:
- Check if the feature already exists (partially or fully)
- Verify the feature is still needed per CLAUDE.md
- Confirm the technical approach is still valid
- Check if dependencies/prerequisites are met

### For REFACTOR tasks:
- Verify the code smell/issue still exists
- Check if recent changes already addressed it
- Confirm the refactor is still valuable

3. **Report findings** in this format:

```
## Task Review: {task-id}

**Status**: STILL VALID | PARTIALLY FIXED | ALREADY FIXED | OUTDATED | NEEDS UPDATE

**Reproduction**:
- Steps taken to verify
- Screenshots if applicable

**Findings**:
- What was observed
- Differences from task description (if any)

**Recommendation**:
- KEEP: Task is valid, proceed as planned
- UPDATE: Task needs updated description/approach
- CLOSE: Issue no longer exists
- SPLIT: Task should be broken into smaller tasks
- MERGE: Task overlaps with another task

**Notes**:
- Any additional context
```

4. **If task needs updates**, propose specific edits to the task file.

5. **If task should be closed**, move it to `.task-board/done/` or delete it.

## Example Usage
```
/review-task 140
/review-task 142-BUG-gjeld-chart-empty
```
