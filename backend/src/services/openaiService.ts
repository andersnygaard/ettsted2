/**
 * OpenAI Service
 *
 * Integrates with OpenAI API for extracting structured portfolio data from user input.
 * Uses function calling to extract dates, account names, values, and asset classes
 * in Norwegian financial format.
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { createTrace, logGeneration, logEvent } from './langfuseService';

/**
 * Initialize OpenAI client
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * System prompt for Norwegian financial data extraction
 */
const SYSTEM_PROMPT = `You are a financial data extraction assistant for a Norwegian portfolio tracking app.
Extract portfolio snapshots from user input. Output structured data using the provided function.

Rules:
- Dates should be in dd.MM.yyyy format (Norwegian style)
- Values are in NOK (Norwegian Kroner)
- Parse Norwegian number formats (space as thousands separator, comma as decimal)
  Example: 150 000,50 kr = 150000.50
- Asset classes: aksjer, fond, krypto, bankkonto, lån, pensjon
- For each account, extract: name, value (as number), assetClass
- If date is ambiguous, ask for clarification
- If values seem unrealistic, ask for confirmation
- Negative values indicate debt (gjeld/lån)`;

/**
 * Tool definition for batch inserting snapshots
 */
const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'batch_insert_snapshots',
      description: 'Insert monthly portfolio snapshots with account balances',
      parameters: {
        type: 'object',
        properties: {
          snapshots: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: 'Date in dd.MM.yyyy format (e.g., "01.01.2024")',
                },
                accounts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Account name (e.g., "Nordnet ASK", "Huslån")',
                      },
                      value: {
                        type: 'number',
                        description: 'Value in NOK (negative for debt)',
                      },
                      assetClass: {
                        type: 'string',
                        enum: ['aksjer', 'fond', 'krypto', 'bankkonto', 'lån', 'pensjon'],
                        description: 'Asset class category',
                      },
                    },
                    required: ['name', 'value', 'assetClass'],
                  },
                },
              },
              required: ['date', 'accounts'],
            },
          },
        },
        required: ['snapshots'],
      } as unknown as OpenAI.FunctionParameters,
    },
  },
];

/**
 * Extracted snapshot with date and accounts
 */
export interface ExtractedSnapshot {
  date: string;
  accounts: {
    name: string;
    value: number;
    assetClass: string;
  }[];
}

/**
 * Result of portfolio data extraction
 */
export interface ExtractionResult {
  success: boolean;
  snapshots?: ExtractedSnapshot[];
  message?: string;
  needsClarification?: boolean;
}

/**
 * Extract portfolio data from user message using OpenAI function calling
 *
 * @param userMessage - User-provided portfolio data (text, paste from Excel, etc.)
 * @param conversationHistory - Previous messages in the conversation for context
 * @param userId - User ID for Langfuse tracing
 * @returns ExtractionResult with extracted snapshots or clarification message
 */
export async function extractPortfolioData(
  userMessage: string,
  conversationHistory: OpenAI.ChatCompletionMessageParam[] = [],
  userId?: string
): Promise<ExtractionResult> {
  // Create Langfuse trace for this operation
  const trace = createTrace('openai-data-extraction', {
    userId,
    metadata: {
      messageCount: conversationHistory.length + 1,
      userMessageLength: userMessage.length,
    },
  });

  const traceId = trace?.id;

  try {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    logger.info('Calling OpenAI API for data extraction', {
      messageCount: messages.length,
      userMessageLength: userMessage.length,
      traceId,
    });

    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.3, // Lower temperature for more consistent data extraction
      max_tokens: 2000,
    });

    const durationMs = Date.now() - startTime;

    logger.info('OpenAI API response received', {
      finishReason: response.choices[0].finish_reason,
      hasToolCall: !!response.choices[0].message.tool_calls,
      durationMs,
      traceId,
    });

    // Log generation to Langfuse with token usage
    logGeneration(
      traceId,
      'gpt-4-turbo-preview-extraction',
      {
        model: 'gpt-4-turbo-preview',
        temperature: 0.3,
        max_tokens: 2000,
      },
      JSON.stringify(response.choices[0].message),
      {
        prompt_tokens: response.usage?.prompt_tokens,
        completion_tokens: response.usage?.completion_tokens,
        total_tokens: response.usage?.total_tokens,
      },
      durationMs
    );

    // Log token usage
    logEvent(traceId, 'token-usage', {
      promptTokens: response.usage?.prompt_tokens,
      completionTokens: response.usage?.completion_tokens,
      totalTokens: response.usage?.total_tokens,
    });

    const choice = response.choices[0];

    // Check if model wants to call function
    if (choice.message.tool_calls?.[0]) {
      const toolCall = choice.message.tool_calls[0];

      if (toolCall.function.name === 'batch_insert_snapshots') {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          logger.info('Successfully extracted portfolio data', {
            snapshotCount: args.snapshots?.length || 0,
            traceId,
          });

          // Log successful extraction event
          logEvent(traceId, 'extraction-success', {
            snapshotCount: args.snapshots?.length,
          });

          return {
            success: true,
            snapshots: args.snapshots,
          };
        } catch (parseError) {
          logger.error('Failed to parse function arguments', {
            error: parseError instanceof Error ? parseError.message : String(parseError),
            arguments: toolCall.function.arguments,
            traceId,
          });

          // Log parsing error event
          logEvent(traceId, 'extraction-parse-error', {
            error: parseError instanceof Error ? parseError.message : String(parseError),
          });

          return {
            success: false,
            message: 'Kunne ikke tolke de ekstraherte dataene. Vennligst prøv igjen.',
            needsClarification: true,
          };
        }
      }
    }

    // Model responded with text (needs clarification)
    const textResponse = choice.message.content || 'Kunne ikke tolke data';
    logger.info('Model requested clarification', {
      responseLength: textResponse.length,
      traceId,
    });

    // Log clarification needed event
    logEvent(traceId, 'extraction-clarification-needed', {
      responseLength: textResponse.length,
    });

    return {
      success: false,
      message: textResponse,
      needsClarification: true,
    };
  } catch (error) {
    logger.error('OpenAI API error during extraction', {
      error: error instanceof Error ? error.message : String(error),
      errorCode: error instanceof OpenAI.APIError ? error.error?.code : undefined,
      errorType: error instanceof OpenAI.APIError ? error.error?.type : undefined,
      traceId,
    });

    // Log error event
    logEvent(traceId, 'extraction-error', {
      errorType: error instanceof OpenAI.APIError ? error.error?.type : 'unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Handle specific API errors
    if (error instanceof OpenAI.APIError) {
      let message = 'En feil oppstod under databehandlingen';

      if (error.status === 401) {
        message = 'OpenAI API-nøkkel er ikke konfigurert korrekt';
      } else if (error.status === 429) {
        message = 'For mange forespørsler til OpenAI. Vennligst prøv igjen senere.';
      } else if (error.status === 500) {
        message = 'OpenAI-service er midlertidig utilgjengelig. Prøv igjen senere.';
      }

      return {
        success: false,
        message,
        needsClarification: false,
      };
    }

    // Re-throw unknown errors for global error handler
    throw error;
  }
}

/**
 * Parse Norwegian number format to decimal number
 * Example: "150 000,50" -> 150000.50
 *
 * @param norwegianNumber - Norwegian formatted number
 * @returns Decimal number
 */
export function parseNorwegianNumber(norwegianNumber: string): number {
  if (!norwegianNumber) return 0;

  // Remove spaces (thousands separator)
  const noSpaces = norwegianNumber.replace(/\s/g, '');
  // Replace comma (decimal separator) with period
  const normalized = noSpaces.replace(',', '.');

  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse Norwegian date format to ISO string
 * Example: "01.01.2024" -> "2024-01-01"
 *
 * @param norwegianDate - Norwegian formatted date (dd.MM.yyyy)
 * @returns ISO date string
 */
export function parseNorwegianDate(norwegianDate: string): string {
  const parts = norwegianDate.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid Norwegian date format: ${norwegianDate}`);
  }

  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
