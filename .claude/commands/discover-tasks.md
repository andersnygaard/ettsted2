---
description: Find ALL gaps by scanning entire codebase vs CLAUDE.md (bulk, broad→narrow)
---

# Bulk Task Discovery

Activate the `backlog-scan` skill to analyze the entire finans codebase and generate a comprehensive backlog.

**This is bulk mode (broad→narrow).** Scans entire app vs CLAUDE.md.

**🚨 CREATES TASKS ONLY - NO IMPLEMENTATION**

For ONE specific task, use `/new-task` instead (narrow→broad).

## What Happens

The `backlog-scan` skill will:

1. **Context Loading (ALL)**
   - Load ALL rules from `.claude/rules/`
   - Check ALL completed tasks in `.task-board/done/`
   - Note ALL available implementation skills

2. **Broad Analysis**
   - Read CLAUDE.md completely
   - Scan all features, routes, components
   - Compare against spec, find ALL gaps

3. **Task Generation**
   - Apply quality bar (only valuable, well-scoped work)
   - Delegate each task to `task-board` skill
   - Assign sequential numbers based on priority

4. **Organization**
   - Enhance vague existing tasks
   - Merge duplicates
   - Remove outdated tasks

## Output

Comprehensive, numbered backlog in `.task-board/backlog/`

## When to Use

- Starting new development phase
- Backlog is stale or empty
- Want comprehensive gap analysis
- Need to organize/renumber existing tasks

## See Also

- `/new-task` - For ONE specific task (narrow→broad, uses `feature-planning` skill)
- `/review-task` - Validate existing task
