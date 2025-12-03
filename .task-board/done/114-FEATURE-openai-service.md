# 114 - Feature: OpenAI Service

**Type**: FEATURE
**Priority**: High
**Effort**: Medium (4-6 hours)
**Labels**: backend, llm, openai
**Parent**: [109-EPIC-llm-data-import.md](109-EPIC-llm-data-import.md)

---

## Context

Backend service for OpenAI API integration with function calling. Extracts structured portfolio data from user-provided text (Excel pastes, bank statements, typed descriptions).

---

## Acceptance Criteria

- [x] OpenAI SDK configured with API key from environment
- [x] Function definition for `batch_insert_snapshots`
- [x] System prompt optimized for Norwegian financial data extraction
- [x] Date parsing supports Norwegian format (dd.MM.yyyy)
- [x] Number parsing supports Norwegian format (123 456,78)
- [x] Error handling for API failures, rate limits, invalid responses
- [ ] Unit tests for extraction logic (separate task)

---

## Technical Approach

### 1. Install OpenAI SDK

```bash
cd backend && pnpm add openai
```

### 2. Create Service

```typescript
// backend/src/services/openaiService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a financial data extraction assistant for a Norwegian portfolio tracking app.
Extract portfolio snapshots from user input. Output structured data using the provided function.

Rules:
- Dates should be in dd.MM.yyyy format (Norwegian)
- Values are in NOK (Norwegian Kroner)
- Parse Norwegian number formats (space as thousands separator, comma as decimal)
- Asset classes: aksjer, fond, krypto, bankkonto, lån, pensjon
- If date is ambiguous, ask for clarification
- If values seem unrealistic, ask for confirmation`;

const tools: OpenAI.ChatCompletionTool[] = [{
  type: "function",
  function: {
    name: "batch_insert_snapshots",
    description: "Insert monthly portfolio snapshots with account balances",
    parameters: {
      type: "object",
      properties: {
        snapshots: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "Date in dd.MM.yyyy format"
              },
              accounts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    value: { type: "number", description: "Value in NOK" },
                    assetClass: {
                      type: "string",
                      enum: ["aksjer", "fond", "krypto", "bankkonto", "lån", "pensjon"]
                    }
                  },
                  required: ["name", "value", "assetClass"]
                }
              }
            },
            required: ["date", "accounts"]
          }
        }
      },
      required: ["snapshots"]
    }
  }
}];

export interface ExtractedSnapshot {
  date: string;
  accounts: {
    name: string;
    value: number;
    assetClass: string;
  }[];
}

export interface ExtractionResult {
  success: boolean;
  snapshots?: ExtractedSnapshot[];
  message?: string;
  needsClarification?: boolean;
}

export async function extractPortfolioData(
  userMessage: string,
  conversationHistory: OpenAI.ChatCompletionMessageParam[] = []
): Promise<ExtractionResult> {
  try {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      tools,
      tool_choice: "auto",
    });

    const choice = response.choices[0];

    // Check if model wants to call function
    if (choice.message.tool_calls?.[0]) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function.name === "batch_insert_snapshots") {
        const args = JSON.parse(toolCall.function.arguments);
        return {
          success: true,
          snapshots: args.snapshots,
        };
      }
    }

    // Model responded with text (needs clarification)
    return {
      success: false,
      message: choice.message.content || "Kunne ikke tolke data",
      needsClarification: true,
    };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      return {
        success: false,
        message: `OpenAI API error: ${error.message}`,
      };
    }
    throw error;
  }
}
```

### 3. Environment Variable

Add to `backend/.env`:
```bash
OPENAI_API_KEY=sk-...
```

---

## Files to Create

- [backend/src/services/openaiService.ts](backend/src/services/openaiService.ts)

## Files to Modify

- [backend/.env.example](backend/.env.example) - Add OPENAI_API_KEY

---

## Dependencies

- OpenAI npm package
- Environment variable OPENAI_API_KEY

---

## Verification

```typescript
// Manual test
const result = await extractPortfolioData(`
  Januar 2024:
  Nordnet ASK: 150 000 kr
  Kryptobørsen: 25 000 kr
  Huslån: -2 000 000 kr
`);

expect(result.success).toBe(true);
expect(result.snapshots).toHaveLength(1);
expect(result.snapshots[0].date).toBe("01.01.2024");
```

---

## Implementation Notes

### Files Created
- `backend/src/services/openaiService.ts` - Complete OpenAI service with:
  - OpenAI SDK initialization with API key from environment
  - System prompt optimized for Norwegian financial data extraction
  - Function definition for `batch_insert_snapshots` with proper JSON schema
  - `extractPortfolioData()` function with conversation history support
  - Helper functions: `parseNorwegianNumber()` and `parseNorwegianDate()`
  - Comprehensive error handling (API errors, rate limits, parse errors)
  - Structured logging for debugging and observability

### Key Features
1. **OpenAI Client**: Uses `gpt-4-turbo-preview` model with temperature 0.3 for consistent extraction
2. **Function Calling**: Proper tool definition with JSON schema for reliable data extraction
3. **Norwegian Support**:
   - Dates: dd.MM.yyyy format
   - Numbers: Space thousands separator, comma decimal separator
   - Asset classes: aksjer, fond, krypto, bankkonto, lån, pensjon
4. **Error Handling**:
   - API authentication errors (401)
   - Rate limit errors (429)
   - Server errors (500)
   - Parse errors with user-friendly messages
   - Structured logging with context
5. **Conversation Support**: Accepts conversation history for multi-turn interactions

### Build Status
- TypeScript compilation: PASS (pnpm type-check)
- esbuild bundling: PASS (pnpm build)
- No compilation errors or warnings

### Ready for Integration
The service is ready for:
1. Import into controllers/routes for API endpoints
2. Integration with import/chat endpoint
3. Error handling in global error handler
4. Logging and observability integration
