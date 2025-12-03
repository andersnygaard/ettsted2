# Planning Board - Finans

**Current Focus**: Bug fixes and feature enhancements

---

## Dependency Graph

```
108 Sparing Use API Data (Bug Fix)
 └── No dependencies

109 Logging Refactor
 └── No dependencies

114 OpenAI Service
 └── 115 Langfuse Integration (optional)
      └── 116 Import Routes
           └── 117 Import Page UI

110 Milestone Detection
 └── No dependencies (SpreadsheetTable already supports it)

111 E2E Test Coverage
 └── No dependencies

112 Delete Snapshot UI
 └── No dependencies (Backend exists)

113 Economy Wizard Values
 └── No dependencies

118 Terms/Privacy Dialog
 └── No dependencies
```

---

## Top Priorities

_No tasks in backlog. Run task-discovery skill to identify new work._

---

## Recently Completed

### 118 - Terms/Privacy Dialog (2025-12-03)
Clickable terms link in login screens. Tabbed dialog with Vilkår/Personvern content.

### 113 - Economy Wizard Values (2025-12-03)
Load latest snapshot values in economy wizard. TanStack Query fetch, case-insensitive account matching.

### 112 - Delete Snapshot UI (2025-12-03)
Trash button on portfolio rows. Confirmation modal, toast notifications, TanStack Query invalidation.

### 111 - E2E Test Coverage (2025-12-03)
70 test cases across 8 files. Login, navigation, portfolio modal, calculators, page content.

### 109 - Logging Refactor (2025-12-03)
AsyncLocalStorage for request context, auto requestId/userId injection, sensitive data sanitization.

### 110 - Milestone Detection (2025-12-03)
Gold highlights in Portfolio table when account values cross thresholds (10k, 100k, 1M, etc.). Uses existing SpreadsheetTable styling.

### 117 - Import Page UI (2025-12-03)
Chat interface at /import for LLM data extraction. Messages, data preview, confirm/cancel flow.

### 116 - Import Routes (2025-12-03)
POST /api/v1/import/chat and /batch endpoints. Rate limiting, Zod validation, conversation history.

### 115 - Langfuse Integration (2025-12-03)
LLM observability with Langfuse Cloud (EU). Traces OpenAI calls with token usage.

### 114 - OpenAI Service (2025-12-03)
OpenAI SDK integration with function calling for `batch_insert_snapshots`. Norwegian data extraction.

### 108 - Sparing Use API Data Bug Fix (2025-12-03)
Removed hardcoded values from useSparingData.ts. Now fetches real data from `/api/v1/sparing` and `/api/v1/users/me`.

### 107 - Update Frontend Imports (2025-12-01)
22 imports updated to @finans/components. Build passes with no TypeScript errors.

### 106 - Migrate System Components (2025-12-01)
Toast and ErrorBoundary migrated. 10 stories created.

### 105 - Migrate Layout Components (2025-12-01)
4 components migrated (PageHeader, SectionLink, CalculatorCard, Container). 24 stories created.

### 104 - Migrate Data Display Components (2025-12-01)
10 components migrated. 61 stories created.

### 103 - Migrate Form Components (2025-12-01)
NumberInput, DateInput, ProgressBar migrated with Norwegian formatting utilities. 26 stories.

### 102 - Migrate Core UI Components (2025-12-01)
Button, Card, Container, Avatar, Modal, Skeleton, Breadcrumb migrated.

### 101 - Storybook Config (2025-12-01)
Storybook infrastructure setup in /components workspace.

### 100 - Design Polish (2025-12-01)
Unified hover states, design tokens applied across 11 files.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 104 |
| Backlog | 0 |
| In Progress | 0 |

**Backlog Breakdown**:
- Empty! All tasks complete.

**🎉 BACKLOG CLEARED** - All 104 tasks completed

**Last Updated**: 2025-12-03
