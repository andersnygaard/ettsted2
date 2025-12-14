---
description: Plan ONE specific task you have in mind (focused, narrow→broad)
---

# New Task

Activate the `feature-planning` skill to scope and plan ONE specific task you already have in mind.

**This is focused mode (narrow→broad).** Starts at your focus point, expands only as needed.

**🚨 CREATES TASK ONLY - NO IMPLEMENTATION**

For bulk backlog generation, use `/discover-tasks` instead (broad→narrow).

## What Happens

The `feature-planning` skill will:

1. **Ask**: "What do you want to work on?"

2. **Context Loading (Area-Specific)**
   - Identify area (frontend, backend, components, e2e)
   - Load ONLY relevant rules from `.claude/rules/{area}/`
   - Check ONLY related done/ tasks
   - Detect implementation skill (frontend-design, node-backend, etc.)

3. **Focused Research (Narrow→Broad)**
   ```
   Your focus (component, file, screenshot)
       ↓
   Direct dependencies (imports, props, CSS)
       ↓
   Related components (only if needed)
       ↓
   STOP when enough context
   ```

4. **Propose Task** - Title, type, scope, skill

5. **Create Task** - Delegate to `task-board` skill

6. **End** - Confirm creation and STOP. Do not offer implementation.

## End of Flow

After task creation, output exactly:
```
✓ Task created: [filename]

Ready in backlog. To implement, use `start-working` skill or ask directly.
```

Then STOP. Do not ask follow-up questions. The user will initiate next action.

## Example

```
User: "I want to fix the column width in the last column"

1. Area: frontend (SpreadsheetTable)
2. Load: .claude/rules/frontend/
3. Research: SpreadsheetTable → CSS → column logic
4. Propose: BUG-spreadsheet-column-width
5. Skill: frontend-design
```

## Rules

- ONE task at a time
- Ask before researching
- Ask before creating
- Start narrow, expand only as needed

## See Also

- `/discover-tasks` - For bulk backlog (broad→narrow, uses `backlog-scan` skill)
- `/review-task` - Validate existing task
