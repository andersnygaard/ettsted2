# Design: Mobile-First Import Page (Chat Interface)

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Low
**Labels**: frontend, design, mobile, import, chat
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Import page has a chat interface for AI-assisted data import. The current implementation already has good mobile styles - this is mostly a refactor to mobile-first pattern for consistency.

## Current State

- Chat interface adapts well to mobile
- Input area has proper iOS zoom prevention (16px font)
- Send button is 44px on mobile (good)
- Empty state scales down
- Footer buttons stack on mobile
- Uses `max-width` queries (desktop-first)

## Desired Outcome

- Refactor to mobile-first CSS for consistency
- Minor polish if any issues found during refactor

## Acceptance Criteria

- [ ] Refactor ImportPage.css to mobile-first
- [ ] Verify chat message styles work on mobile
- [ ] Verify input area is thumb-friendly
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/import/ImportPage.css`
  - `frontend/src/features/import/ChatMessage.css`
  - `frontend/src/features/import/DataPreview.css`

## Technical Approach

### Implementation Steps

1. **Refactor ImportPage.css to mobile-first**:
   ```css
   /* BASE: Mobile */
   .import-page__header {
     padding: var(--space-2xl) var(--space-md) var(--space-lg);
   }

   .chatbot {
     padding: 0 var(--space-sm);
   }

   .chatbot__messages {
     gap: var(--space-lg);
   }

   .chatbot__empty {
     padding: var(--space-3xl) var(--space-lg);
   }

   .chatbot__empty-icon {
     width: 56px;
     height: 56px;
   }

   .chatbot__empty h3 {
     font-size: 20px;
   }

   .chatbot__input-area {
     padding: var(--space-md) 0;
   }

   .chatbot__input {
     padding: 12px 16px;
     min-height: 100px;
     font-size: 16px;  /* Prevents iOS zoom */
   }

   .chatbot__send {
     width: 44px;
     height: 44px;
   }

   .import-page__footer {
     flex-direction: column;
     padding: var(--space-sm) var(--space-md) var(--space-xl);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .import-page__header {
       padding: var(--space-4xl) var(--space-md) var(--space-xl);
     }

     .chatbot {
       padding: 0 var(--space-md);
     }

     .chatbot__messages {
       gap: var(--space-xl);
     }

     .chatbot__empty {
       padding: var(--space-5xl) var(--space-xl);
     }

     .chatbot__empty-icon {
       width: 64px;
       height: 64px;
     }

     .chatbot__empty h3 {
       font-size: var(--font-size-lg);
     }

     .chatbot__input-area {
       padding: var(--space-lg) 0 var(--space-md);
     }

     .chatbot__input {
       padding: 14px 20px;
       min-height: auto;
       font-size: var(--font-size-md);
     }

     .chatbot__send {
       width: 48px;
       height: 48px;
     }

     .import-page__footer {
       flex-direction: row;
       padding: var(--space-md);
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Low - current implementation is already good
- **Mitigation**: Careful testing during refactor

## Code References

### Current Pattern
```css
/* ImportPage.css:275-329 - Desktop-first but well-implemented */
@media (max-width: var(--bp-sm)) {
  .import-page__header {
    padding: var(--space-2xl) var(--space-md) var(--space-lg);
  }
  .chatbot__input {
    font-size: 16px; /* Prevents iOS zoom */
  }
  /* ... */
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
