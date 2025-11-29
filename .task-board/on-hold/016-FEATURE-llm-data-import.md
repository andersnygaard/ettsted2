# FEATURE: LLM Data Import (Backend + Frontend)

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Medium
**Labels**: backend, frontend, llm, openai, langfuse, import
**Estimated Effort**: Complex - 5-6 days

## Context & Motivation

Users should be able to paste portfolio data from Excel or text and have an LLM extract structured data for import. This uses OpenAI function calling and Langfuse for observability.

## Desired Outcome

**Backend**:
- `POST /api/v1/import/chat` - Send user message to LLM
- `POST /api/v1/import/batch` - Batch insert snapshots (called by LLM function)
- OpenAI integration with function calling
- Langfuse tracing for LLM requests

**Frontend**:
- Import page with chat interface
- User pastes data, submits message
- Show LLM response
- Confirm and import extracted data

## Acceptance Criteria

- [ ] Backend OpenAI client configured
- [ ] Langfuse integration working
- [ ] LLM function definition for `batch_insert_snapshots`
- [ ] Extract snapshots from user input (dates, accounts, values)
- [ ] Validate extracted data before insertion
- [ ] Frontend chat UI with input and message history
- [ ] Confirm dialog before importing
- [ ] Success message with imported snapshot count
- [ ] Rate limited (20 req/min)

## Technical Approach

**Backend OpenAI Function**:
```typescript
const tools = [{
  type: "function",
  function: {
    name: "batch_insert_snapshots",
    description: "Insert multiple monthly snapshots",
    parameters: {
      type: "object",
      properties: {
        snapshots: {
          type: "array",
          items: {
            properties: {
              date: { type: "string", description: "dd.MM.yyyy" },
              accounts: {
                type: "array",
                items: {
                  properties: {
                    name: { type: "string" },
                    value: { type: "number" },
                    assetClass: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}];

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: userMessage }],
  tools
});

// If function call, execute batch insert
if (response.choices[0].message.tool_calls) {
  const args = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
  await batchInsertSnapshots(userId, args.snapshots);
}
```

**Frontend Chat UI**:
```tsx
export function ImportPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = useMutation({
    mutationFn: (message: string) => apiClient.post('/import/chat', { message }),
    onSuccess: (res) => setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: res.data.data.response }])
  });

  return (
    <div>
      <h1>Importer data med AI</h1>
      <div>{messages.map(m => <div key={m.content}>{m.role}: {m.content}</div>)}</div>
      <textarea placeholder="Lim inn data fra Excel..." value={input} onChange={...} />
      <button onClick={() => sendMessage.mutate(input)}>Send</button>
    </div>
  );
}
```

## Dependencies

- `FEATURE-backend-express-server.md`
- `FEATURE-portfolio-api-endpoints.md`
- `FEATURE-frontend-react-initialization.md`
- Langfuse deployment (separate Azure App Service)

## Risks & Considerations

- **Risk**: LLM extracts incorrect data → **Mitigation**: Show confirmation dialog, allow user to review before import
- **Risk**: Expensive OpenAI costs → **Mitigation**: Rate limiting, monitor usage
- **Risk**: Langfuse not deployed → **Mitigation**: Make optional, log locally if unavailable

## Related Plans

- `FEATURE-portfolio-api-endpoints.md`
- `EXPLORE-langfuse-deployment.md` (prerequisite)

---

**Next Steps**: Ready after portfolio API complete and Langfuse deployed.
