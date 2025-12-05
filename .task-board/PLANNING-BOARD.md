# Planning Board - Finans

**Current Focus**: User-requested polish and improvements

---

## Dependency Graph

```
127 Consistent Page Headers
 └── No dependencies

128 Consistent Breadcrumbs
 └── No dependencies

129 App Header Logo Two Lines
 └── No dependencies

130 Negative Net Worth Focus Positives
 └── No dependencies

132 User Self-Delete GDPR
 └── No dependencies

133 Terms Dialog Tabs Clearer
 └── No dependencies

134 Close Button Positioning
 └── No dependencies

135 Date Header Z-Index
 └── No dependencies

136 Checkbox Lighter Background
 └── No dependencies

137 Import Agent Initial Messages
 └── No dependencies

138 New Month Datepicker
 └── No dependencies

139 New Month Copy Previous
 └── 138 (same modal)
```

---

## Top Priorities

| # | Task | Type | Effort | Status |
|---|------|------|--------|--------|
| 129 | App Header Logo Two Lines | FEATURE | Small | Ready |
| 130 | Negative Net Worth Focus Positives | FEATURE | Medium | Ready |
| 133 | Terms Dialog Tabs Clearer | REFACTOR | Small | Ready |
| 134 | Close Button Positioning | REFACTOR | Small | Ready |
| 135 | Date Header Z-Index | REFACTOR | Quick | Ready |

---

## Full Backlog

### Medium Priority
- **130** - Negative Net Worth Focus Positives (Medium)
- **133** - Terms Dialog Tabs Clearer (Small)
- **134** - Close Button Positioning (Small)
- **135** - Date Header Z-Index (Quick)
- **137** - Import Agent Initial Messages (Small)
- **138** - New Month Datepicker (Medium)
- **139** - New Month Copy Previous (Medium)

### Low Priority
- **129** - App Header Logo Two Lines (Small)
- **136** - Checkbox Lighter Background (Quick)

---

## Recently Completed

### 128 - Consistent Breadcrumbs (2025-12-05)
Added breadcrumbs to all main pages: Portefølje, Sparing, Gjeld, Pensjon, Kalkulatorer. Format: "Hjem → [Page]".

### 127 - Consistent Page Headers (2025-12-05)
All main pages now left-aligned. Kalkulatorer landing page centered (intentional). Added `centered` prop to PageHeader component.

### 126 - Page Card Grid Component (2025-12-04)
Reusable 2-column grid in /components. Props: columns, gap, reversed. 8 Storybook stories. All 4 calculator pages updated.

### 125 - Wizard Form Card Design (2025-12-04)
Wrapped Step 1 form in Card component. White background improves input field contrast.

### 124 - Wizard Button Consistent Color (2025-12-04)
Added `!important` to button styles to override BeerCSS cascade. Button now consistently black.

### 123 - Rename Calculator Routes (2025-12-04)
Routes renamed to Norwegian: `/kalkulatorer/rentes-rente`, `/kalkulatorer/lan`. Redirects added for backward compatibility.

### 132 - User Self-Delete GDPR (2025-12-04)
GDPR-compliant account deletion. DELETE /api/v1/users/me endpoint. DeleteAccountModal with SLETT confirmation. Logs out and redirects to home.

### 131 - Monte Carlo Graph on Submit (2025-12-04)
Graph only updates on "Kjør simulering" click. Tracks submitted years separately from input state.

### 122 - CSS Polish Batch (2025-12-04)
Added --border-subtle token. Updated 16 CSS files with subtle borders, text-overflow fixes, mobile responsive font sizes.

### 121 - Economy Allow Negative Gjeld (2025-12-04)
Allow negative gjeld input in economy wizard. Values stored as positive (Math.abs). Helper text added.

### 120 - Import Agent Preload Accounts (2025-12-04)
Preloads user accounts in system prompt with fuzzy matching rules. Reduces latency by eliminating tool call overhead.

### 119 - Cleanup Unused Files (2025-12-04)
Deleted unused documentation files: backend/TESTING-AUTH-MIDDLEWARE.md, backend/test-user-endpoints.md, frontend/src/shared/utils/README.md.

### 118 - Terms/Privacy Dialog (2025-12-03)
Clickable terms link in login screens. Tabbed dialog with Vilkår/Personvern content.

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

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 130 |
| Backlog | 9 |
| In Progress | 0 |

**Backlog Breakdown**:
- REFACTOR: 4 tasks (133, 134, 135, 136)
- FEATURE: 5 tasks (129, 130, 137, 138, 139)

**Last Updated**: 2025-12-05
