/**
 * Import Agent Service
 *
 * Agentic LLM service for importing portfolio data.
 * Uses OpenAI function calling with an agent loop that executes tools directly.
 *
 * Tools:
 * - get_user_accounts: Get user's configured accounts for name matching
 * - get_existing_snapshots: Get existing snapshots to avoid duplicates
 * - upsert_snapshot: Create or update a monthly snapshot with accounts
 *
 * All tool executions are logged to Langfuse for observability.
 */

import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';
import {
  createTrace,
  createSpan,
  endSpan,
  logGenerationToParent,
  logEventToParent,
  flushLangfuse,
  LangfuseTraceClient,
} from './langfuseService';
import { getUserById } from './userService';
import {
  createSnapshot,
  getSnapshotsByUserId,
  updateSnapshot,
} from './portfolioService';
import { MonthlySnapshot, Account } from '../models/Portfolio';
import { AccountConfig } from '../models/User';

/**
 * OpenAI client
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Maximum agent loop iterations to prevent infinite loops
 */
const MAX_ITERATIONS = 20;

/**
 * Build system prompt with user's preloaded accounts
 */
function buildSystemPrompt(accounts: AccountConfig[]): string {
  const accountsList = accounts
    .map((a) => `  - ${a.name} (${a.category})`)
    .join('\n');

  return `You are a portfolio data import assistant for a Norwegian finance app called Finans.
SPEAK NORWEGIAN. All responses must be in Norwegian.

GUARDRAILS - STRICT BOUNDARIES:
- You can ONLY help with importing portfolio data
- If the user asks about anything else (weather, jokes, coding, general questions, etc.), politely redirect:
  "Jeg kan bare hjelpe med å importere porteføljedata. Lim inn data fra Excel eller nettbank, så hjelper jeg deg."
- Never discuss topics outside of data import
- Never execute code or provide information unrelated to portfolio import
- If input doesn't look like financial data, ask: "Dette ser ikke ut som porteføljedata. Kan du lime inn data fra Excel eller nettbank?"

YOUR JOB: Extract portfolio data from user input (Excel pastes, text, etc.) and import it into the database.

PARSING RULES:
1. Norwegian number formats: spaces = thousands separator, comma = decimal (e.g., "175 584,24" = 175584.24)
2. Remove "kr" currency symbols when parsing
3. Dates: dd.MM.yyyy format (e.g., "01.09.2022")
4. ALWAYS use the FIRST day of the month for all dates. Normalize "15.12.2025" → "01.12.2025", "desember 2025" → "01.12.2025". This is a monthly tracking app - all snapshots must be on the 1st.
5. "kr -" or "-" = 0 or no value
6. Asset classes: aksjer, fond, krypto, bankkonto, lån, pensjon

USER'S CONFIGURED ACCOUNTS:
${accountsList || '  (No accounts configured yet)'}

ACCOUNT MATCHING RULES:
1. Match case-insensitively ("nordnet" = "Nordnet ASK")
2. Match partial names ("Aksjer" matches "Nordnet Aksjer", "Nordnet" alone matches "Nordnet ASK")
3. If user pastes MORE columns than accounts, ask which columns to ignore or skip
4. If user pastes FEWER columns, proceed with available data
5. When unsure about matching, list the options and ask user to confirm mapping
6. Use get_user_accounts tool ONLY if user adds new accounts during conversation (edge case)

WORKFLOW - ALWAYS FOLLOW THIS ORDER:
1. When user pastes data, FIRST analyze it WITHOUT importing:
   - Parse the data to identify: dates, account columns, values
   - Try to match columns to configured accounts using fuzzy matching rules above
   - Present a summary to the user in Norwegian:
     "Jeg fant følgende i dataene dine:
      📅 Datoer: [first] til [last] ([count] måneder)
      📊 Kontoer: [list account names found with matching results]

      Vil du importere alle disse? Skriv 'ja' for å fortsette, eller fortell meg hvilke kontoer du vil ha med."

2. WAIT for user confirmation before importing anything!

3. When user confirms (says "ja", "ok", "importer", "fortsett", etc.):
   - Call get_existing_snapshots to check for duplicates
   - Import the data using upsert_snapshot for each month
   - Give a brief summary: "Ferdig! Importerte X nye måneder, oppdaterte Y eksisterende."

4. If user wants specific accounts only, filter and import only those.

IMPORTANT: Never import without asking first. Always present what you found and wait for confirmation.`;
}

/**
 * Tool definitions for OpenAI function calling
 */
const TOOLS: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_user_accounts',
      description: 'Get the user\'s configured accounts to match names from imported data',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_existing_snapshots',
      description: 'Get existing snapshots to check for duplicates and see current data',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of snapshots to return (default: 50)',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'upsert_snapshot',
      description: 'Create or update a monthly portfolio snapshot. If a snapshot exists for the date, it will be updated.',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Date in dd.MM.yyyy format (e.g., "01.09.2022")',
          },
          accounts: {
            type: 'array',
            description: 'Array of accounts with their values',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Account name (e.g., "Nordnet ASK")',
                },
                value: {
                  type: 'number',
                  description: 'Account value in NOK (must be a number, not a string)',
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
];

/**
 * Agent action logged to frontend
 */
export interface AgentAction {
  type: 'tool_call' | 'tool_result' | 'message' | 'error';
  tool?: string;
  input?: unknown;
  output?: unknown;
  message?: string;
  timestamp: Date;
}

/**
 * Result of the import agent run
 */
export interface ImportAgentResult {
  success: boolean;
  message: string;
  actions: AgentAction[];
  snapshotsCreated: number;
  snapshotsUpdated: number;
  totalTokens: number;
}

/**
 * Tool execution context
 */
interface ToolContext {
  userId: string;
  trace: LangfuseTraceClient | null;
  actions: AgentAction[];
}

/**
 * Execute get_user_accounts tool
 */
async function executeGetUserAccounts(
  ctx: ToolContext
): Promise<{ accounts: AccountConfig[] }> {
  const span = createSpan(ctx.trace, 'tool-get-user-accounts', { userId: ctx.userId });

  try {
    const user = await getUserById(ctx.userId);
    const accounts = user?.accounts || [];

    const result = {
      accounts: accounts.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        isActive: a.isActive,
      })),
    };

    endSpan(span, { accountCount: accounts.length });
    logger.info('Tool get_user_accounts executed', { userId: ctx.userId, accountCount: accounts.length });

    return result as { accounts: AccountConfig[] };
  } catch (error) {
    endSpan(span, { error: String(error) }, 'ERROR');
    throw error;
  }
}

/**
 * Execute get_existing_snapshots tool
 */
async function executeGetExistingSnapshots(
  ctx: ToolContext,
  args: { limit?: number }
): Promise<{ snapshots: { date: string; accountCount: number; totalNetWorth: number }[] }> {
  const span = createSpan(ctx.trace, 'tool-get-existing-snapshots', { userId: ctx.userId, limit: args.limit });

  try {
    const snapshots = await getSnapshotsByUserId(ctx.userId, {
      orderBy: 'date',
      ascending: false,
      limit: args.limit || 50,
    });

    const result = {
      snapshots: snapshots.map((s) => ({
        date: s.date,
        accountCount: s.accounts.length,
        totalNetWorth: s.totalNetWorth,
      })),
    };

    endSpan(span, { snapshotCount: snapshots.length });
    logger.info('Tool get_existing_snapshots executed', { userId: ctx.userId, snapshotCount: snapshots.length });

    return result;
  } catch (error) {
    endSpan(span, { error: String(error) }, 'ERROR');
    throw error;
  }
}

/**
 * Execute upsert_snapshot tool
 */
async function executeUpsertSnapshot(
  ctx: ToolContext,
  args: { date: string; accounts: { name: string; value: number; assetClass: string }[] }
): Promise<{ success: boolean; action: 'created' | 'updated'; snapshotId: string; date: string; totalNetWorth: number }> {
  const span = createSpan(ctx.trace, 'tool-upsert-snapshot', {
    userId: ctx.userId,
    date: args.date,
    accountCount: args.accounts.length,
  });

  try {
    // Check if snapshot exists for this date
    const existingSnapshots = await getSnapshotsByUserId(ctx.userId);
    const existing = existingSnapshots.find((s) => s.date === args.date);

    // Build accounts array
    const accounts: Account[] = args.accounts.map((a) => ({
      id: randomUUID(),
      name: a.name,
      value: a.value,
      assetClass: a.assetClass,
    }));

    const totalNetWorth = accounts.reduce((sum, a) => sum + a.value, 0);

    let result: { success: boolean; action: 'created' | 'updated'; snapshotId: string; date: string; totalNetWorth: number };

    if (existing) {
      // Update existing snapshot
      const updated = await updateSnapshot(ctx.userId, existing.id, {
        accounts,
        totalNetWorth,
      });

      result = {
        success: true,
        action: 'updated',
        snapshotId: updated.id,
        date: updated.date,
        totalNetWorth: updated.totalNetWorth,
      };

      logger.info('Snapshot updated via agent', {
        userId: ctx.userId,
        snapshotId: updated.id,
        date: args.date,
      });
    } else {
      // Create new snapshot
      const snapshot: MonthlySnapshot = {
        id: randomUUID(),
        userId: ctx.userId,
        date: args.date,
        accounts,
        totalNetWorth,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const created = await createSnapshot(snapshot);

      result = {
        success: true,
        action: 'created',
        snapshotId: created.id,
        date: created.date,
        totalNetWorth: created.totalNetWorth,
      };

      logger.info('Snapshot created via agent', {
        userId: ctx.userId,
        snapshotId: created.id,
        date: args.date,
      });
    }

    endSpan(span, result);
    return result;
  } catch (error) {
    endSpan(span, { error: String(error) }, 'ERROR');
    throw error;
  }
}

/**
 * Execute a tool call and return the result
 */
async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  ctx: ToolContext
): Promise<unknown> {
  // Log tool call action
  ctx.actions.push({
    type: 'tool_call',
    tool: toolName,
    input: args,
    timestamp: new Date(),
  });

  logEventToParent(ctx.trace, `tool-call-${toolName}`, args);

  let result: unknown;

  switch (toolName) {
    case 'get_user_accounts':
      result = await executeGetUserAccounts(ctx);
      break;
    case 'get_existing_snapshots':
      result = await executeGetExistingSnapshots(ctx, args as { limit?: number });
      break;
    case 'upsert_snapshot':
      result = await executeUpsertSnapshot(
        ctx,
        args as { date: string; accounts: { name: string; value: number; assetClass: string }[] }
      );
      break;
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }

  // Log tool result action
  ctx.actions.push({
    type: 'tool_result',
    tool: toolName,
    output: result,
    timestamp: new Date(),
  });

  logEventToParent(ctx.trace, `tool-result-${toolName}`, undefined, result);

  return result;
}

/**
 * Run the import agent
 *
 * Executes an agent loop that:
 * 1. Sends messages to OpenAI
 * 2. Executes tool calls
 * 3. Returns results to OpenAI
 * 4. Repeats until completion or max iterations
 *
 * @param userMessage - User's message with data to import
 * @param userId - User ID for database operations
 * @param conversationHistory - Previous messages for context
 * @param sessionId - Session ID for grouping conversation in Langfuse
 * @returns ImportAgentResult with actions and summary
 */
export async function runImportAgent(
  userMessage: string,
  userId: string,
  conversationHistory: OpenAI.ChatCompletionMessageParam[] = [],
  sessionId?: string
): Promise<ImportAgentResult> {
  // Create Langfuse trace for this agent run
  // sessionId groups all messages in the same conversation together
  const trace = createTrace('import-agent', {
    userId,
    sessionId,
    metadata: {
      messageLength: userMessage.length,
      historyLength: conversationHistory.length,
    },
  });

  // Log user message explicitly for full visibility
  logEventToParent(trace, 'user-message', { content: userMessage });

  // Log conversation history if present
  if (conversationHistory.length > 0) {
    logEventToParent(trace, 'conversation-history', {
      messageCount: conversationHistory.length,
      messages: conversationHistory.map((m) => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : '[complex content]',
      })),
    });
  }

  const actions: AgentAction[] = [];
  let snapshotsCreated = 0;
  let snapshotsUpdated = 0;
  let totalTokens = 0;

  const ctx: ToolContext = {
    userId,
    trace,
    actions,
  };

  // Fetch user accounts for preloading in system prompt
  let userAccounts: AccountConfig[] = [];
  try {
    const user = await getUserById(userId);
    userAccounts = user?.accounts || [];
    logger.info('Preloaded user accounts for import agent', {
      userId,
      accountCount: userAccounts.length,
    });
  } catch (error) {
    logger.warn('Failed to preload user accounts', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    // Continue without preloaded accounts - agent can call get_user_accounts
    userAccounts = [];
  }

  // Build initial messages with preloaded accounts
  const systemPrompt = buildSystemPrompt(userAccounts);
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  logger.info('Starting import agent', {
    userId,
    messageLength: userMessage.length,
    preloadedAccounts: userAccounts.length,
  });

  logEventToParent(trace, 'agent-start', { messageLength: userMessage.length, preloadedAccounts: userAccounts.length });

  try {
    let iteration = 0;

    // Agent loop
    while (iteration < MAX_ITERATIONS) {
      iteration++;
      const iterationSpan = createSpan(trace, `agent-iteration-${iteration}`, {
        messageCount: messages.length,
      });

      logger.debug(`Agent iteration ${iteration}`, { messageCount: messages.length });

      const startTime = Date.now();

      // Call OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
        max_completion_tokens: 4000,
      });

      const durationMs = Date.now() - startTime;
      const choice = response.choices[0];

      // Track token usage
      if (response.usage) {
        totalTokens += response.usage.total_tokens || 0;
      }

      // Log generation to Langfuse
      logGenerationToParent(
        iterationSpan,
        `gpt-5-nano-iteration-${iteration}`,
        messages.slice(-3), // Last 3 messages for context
        choice.message,
        'gpt-5-nano',
        {
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens,
        },
        durationMs
      );

      // Check if model wants to call tools
      if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
        // Add assistant message with tool calls
        messages.push(choice.message);

        // Execute each tool call
        for (const toolCall of choice.message.tool_calls) {
          const toolName = toolCall.function.name;
          let args: Record<string, unknown> = {};

          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch (parseError) {
            logger.error('Failed to parse tool arguments', {
              toolName,
              arguments: toolCall.function.arguments,
            });
            args = {};
          }

          try {
            const result = await executeTool(toolName, args, ctx);

            // Track snapshot metrics
            if (toolName === 'upsert_snapshot') {
              const upsertResult = result as { action: 'created' | 'updated' };
              if (upsertResult.action === 'created') {
                snapshotsCreated++;
              } else {
                snapshotsUpdated++;
              }
            }

            // Add tool result to messages
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            });
          } catch (toolError) {
            const errorMessage = toolError instanceof Error ? toolError.message : String(toolError);
            logger.error('Tool execution failed', { toolName, error: errorMessage });

            // Add error result to messages
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: errorMessage }),
            });

            actions.push({
              type: 'error',
              tool: toolName,
              message: errorMessage,
              timestamp: new Date(),
            });
          }
        }

        endSpan(iterationSpan, {
          toolCalls: choice.message.tool_calls.length,
          finishReason: choice.finish_reason,
        });
      } else {
        // Model finished - no more tool calls
        const finalMessage = choice.message.content || 'Import completed.';

        actions.push({
          type: 'message',
          message: finalMessage,
          timestamp: new Date(),
        });

        // Log assistant response for full visibility in Langfuse
        logEventToParent(trace, 'assistant-message', { content: finalMessage });

        endSpan(iterationSpan, {
          finishReason: choice.finish_reason,
          finalMessage: finalMessage.substring(0, 200),
        });

        logger.info('Import agent completed', {
          userId,
          iterations: iteration,
          snapshotsCreated,
          snapshotsUpdated,
          totalTokens,
        });

        logEventToParent(trace, 'agent-complete', {
          iterations: iteration,
          snapshotsCreated,
          snapshotsUpdated,
          totalTokens,
        });

        // Flush Langfuse to send traces immediately
        await flushLangfuse();

        return {
          success: true,
          message: finalMessage,
          actions,
          snapshotsCreated,
          snapshotsUpdated,
          totalTokens,
        };
      }
    }

    // Max iterations reached
    logger.warn('Import agent reached max iterations', {
      userId,
      maxIterations: MAX_ITERATIONS,
    });

    logEventToParent(trace, 'agent-max-iterations', { maxIterations: MAX_ITERATIONS }, undefined, 'WARNING');

    // Flush Langfuse to send traces immediately
    await flushLangfuse();

    return {
      success: false,
      message: `Agent reached maximum iterations (${MAX_ITERATIONS}). Some data may not have been imported.`,
      actions,
      snapshotsCreated,
      snapshotsUpdated,
      totalTokens,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Import agent error', { userId, error: errorMessage });

    logEventToParent(trace, 'agent-error', { error: errorMessage }, undefined, 'ERROR');

    // Flush Langfuse to send traces immediately
    await flushLangfuse();

    actions.push({
      type: 'error',
      message: errorMessage,
      timestamp: new Date(),
    });

    return {
      success: false,
      message: `Import failed: ${errorMessage}`,
      actions,
      snapshotsCreated,
      snapshotsUpdated,
      totalTokens,
    };
  }
}
