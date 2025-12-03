# 117 - Feature: Import Page UI

**Type**: FEATURE
**Priority**: High
**Effort**: Medium (6-8 hours)
**Labels**: frontend, ui, llm, chat
**Parent**: [109-EPIC-llm-data-import.md](109-EPIC-llm-data-import.md)

---

## Context

Frontend chat interface for LLM-powered data import. Users paste data, AI extracts it, user confirms, data is inserted.

---

## Acceptance Criteria

- [x] Dedicated import page accessible from navigation or portfolio page
- [x] Chat-style message interface
- [x] Text input with send button
- [x] Display AI responses with extracted data preview
- [x] Confirmation step before inserting data
- [x] Loading states during API calls
- [x] Error handling and retry
- [x] Success feedback with link to portfolio

---

## Technical Approach

### 1. Create Data Hook

```typescript
// frontend/src/features/import/useImportChat.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  extractedData?: ExtractedSnapshot[];
}

interface ExtractedSnapshot {
  date: string;
  accounts: { name: string; value: number; assetClass: string }[];
}

export function useImportChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<ExtractedSnapshot[] | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post('/import/chat', {
        message,
        conversationId,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      setConversationId(data.conversationId);

      if (data.success && data.snapshots) {
        setPendingData(data.snapshots);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Fant ${data.snapshots.length} måned(er) med data. Vil du importere?`,
          extractedData: data.snapshots,
        }]);
      } else if (data.message) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message,
        }]);
      }
    },
  });

  const confirmImport = useMutation({
    mutationFn: async () => {
      if (!pendingData) throw new Error('No data to import');
      const response = await api.post('/import/batch', {
        snapshots: pendingData,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setPendingData(null);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '✓ Data importert! Du kan se den i porteføljen.',
      }]);
    },
  });

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }]);
  };

  const reset = () => {
    setMessages([]);
    setConversationId(null);
    setPendingData(null);
  };

  return {
    messages,
    pendingData,
    isLoading: sendMessage.isPending || confirmImport.isPending,
    sendMessage: (msg: string) => {
      addUserMessage(msg);
      sendMessage.mutate(msg);
    },
    confirmImport: () => confirmImport.mutate(),
    cancelImport: () => setPendingData(null),
    reset,
  };
}
```

### 2. Create Import Page

```tsx
// frontend/src/features/import/ImportPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, PageHeader, Button, Card } from '@finans/components';
import { useImportChat } from './useImportChat';
import { ChatMessage } from './ChatMessage';
import { DataPreview } from './DataPreview';
import './ImportPage.css';

export default function ImportPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const {
    messages,
    pendingData,
    isLoading,
    sendMessage,
    confirmImport,
    cancelImport,
    reset,
  } = useImportChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <main className="import-page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Portefølje', path: '/portfolio' },
            { label: 'Importer data' },
          ]}
        />

        <PageHeader
          title="Importer data"
          subtitle="Lim inn data fra Excel, nettbank, eller skriv det selv"
        />

        <Card className="import-chat">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="import-chat__welcome">
              <p>Lim inn data, så hjelper jeg deg med å importere.</p>
              <p className="import-chat__example">
                Eksempel: "Januar 2024: Nordnet 150k, Fond 80k, Huslån -2M"
              </p>
            </div>
          )}

          {/* Message history */}
          <div className="import-chat__messages">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="import-chat__loading">Tenker...</div>
            )}
          </div>

          {/* Data preview with confirm/cancel */}
          {pendingData && (
            <DataPreview
              snapshots={pendingData}
              onConfirm={confirmImport}
              onCancel={cancelImport}
              isLoading={isLoading}
            />
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="import-chat__form">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Lim inn data her..."
              rows={3}
              disabled={isLoading || !!pendingData}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!input.trim() || isLoading || !!pendingData}
            >
              Send
            </Button>
          </form>
        </Card>

        {/* Actions */}
        <div className="import-page__actions">
          <Button variant="secondary" onClick={() => navigate('/portfolio')}>
            Tilbake til portefølje
          </Button>
          {messages.length > 0 && (
            <Button variant="secondary" onClick={reset}>
              Start på nytt
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
```

### 3. Create Sub-Components

```tsx
// frontend/src/features/import/ChatMessage.tsx
interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    extractedData?: any[];
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`chat-message chat-message--${message.role}`}>
      <div className="chat-message__content">{message.content}</div>
    </div>
  );
}
```

```tsx
// frontend/src/features/import/DataPreview.tsx
import { Button } from '@finans/components';
import { formatNumber, formatDate } from '@finans/components';

interface DataPreviewProps {
  snapshots: any[];
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function DataPreview({ snapshots, onConfirm, onCancel, isLoading }: DataPreviewProps) {
  return (
    <div className="data-preview">
      <h4>Fant følgende data:</h4>
      {snapshots.map((snapshot, i) => (
        <div key={i} className="data-preview__snapshot">
          <strong>{snapshot.date}</strong>
          <ul>
            {snapshot.accounts.map((acc: any, j: number) => (
              <li key={j}>
                {acc.name}: {formatNumber(acc.value)} kr ({acc.assetClass})
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="data-preview__actions">
        <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Importerer...' : 'Importer'}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Avbryt
        </Button>
      </div>
    </div>
  );
}
```

### 4. Add Route

```tsx
// frontend/src/App.tsx or routes config
<Route path="/import" element={<ImportPage />} />
```

### 5. Add Navigation Link

Add link from Portfolio page or navigation menu.

---

## Files to Create

- [frontend/src/features/import/ImportPage.tsx](frontend/src/features/import/ImportPage.tsx)
- [frontend/src/features/import/ImportPage.css](frontend/src/features/import/ImportPage.css)
- [frontend/src/features/import/useImportChat.ts](frontend/src/features/import/useImportChat.ts)
- [frontend/src/features/import/ChatMessage.tsx](frontend/src/features/import/ChatMessage.tsx)
- [frontend/src/features/import/DataPreview.tsx](frontend/src/features/import/DataPreview.tsx)
- [frontend/src/features/import/index.ts](frontend/src/features/import/index.ts)

## Files to Modify

- [frontend/src/App.tsx](frontend/src/App.tsx) - Add route
- [frontend/src/features/portfolio/PortfolioPage.tsx](frontend/src/features/portfolio/PortfolioPage.tsx) - Add link

---

## Dependencies

- Task 116 (Import Routes)
- Existing components from @finans/components

---

## UI Design

Follow Nordic Minimal design system:
- Card container for chat
- User messages aligned right, muted background
- Assistant messages aligned left
- Monospace font for data preview
- Gold accent for confirm button
- Subtle loading animation

---

## Verification

1. Navigate to /import
2. Paste sample data: "Januar 2024: Nordnet 150k"
3. Verify AI response with extracted data
4. Click confirm
5. Verify data appears in portfolio
