# 137-FEATURE: Import Agent Initial Messages

**Priority**: Medium
**Effort**: Small (30 min)
**Labels**: frontend, ux, import

---

## Context

When visiting the import agent (`/import`), the chat should start with pre-populated messages to make the interaction feel more natural:

**User**: "Hei"
**Agent**: "Jeg kan bare hjelpe med å importere porteføljedata. Lim inn data fra Excel eller nettbank, så hjelper jeg deg."

This sets expectations and shows users how to interact.

---

## Acceptance Criteria

- [ ] Two initial messages appear when page loads
- [ ] First message (user bubble): "Hei"
- [ ] Second message (agent bubble): Import instructions
- [ ] Messages appear without API call
- [ ] User can immediately start typing/pasting

---

## Technical Approach

In `ImportPage.tsx`, initialize messages state with default values:

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: 'init-user',
    role: 'user',
    content: 'Hei',
    timestamp: new Date(),
  },
  {
    id: 'init-agent',
    role: 'assistant',
    content: 'Jeg kan bare hjelpe med å importere porteføljedata. Lim inn data fra Excel eller nettbank, så hjelper jeg deg.',
    timestamp: new Date(),
  },
]);
```

These initial messages don't need to be sent to the backend - they're purely for UX.

---

## Files to Modify

- [ImportPage.tsx](frontend/src/features/import/ImportPage.tsx)

---

## Notes

- Don't send these to conversation history on first real user message
- Or optionally, include in history so agent has context
