import { useState } from 'react';
import type { Message, AgentAction } from './useImportChat';
import './ChatMessage.css';

/**
 * ChatMessage Component
 *
 * Renders a single chat message bubble with role-specific styling.
 * User messages appear right-aligned with primary background.
 * Assistant messages appear left-aligned with secondary background.
 *
 * For assistant messages with agent actions, shows a collapsible
 * list of tool calls and their results.
 */

export interface ChatMessageProps {
  message: Message;
}

/**
 * Format tool name for display
 */
function formatToolName(tool: string): string {
  const names: Record<string, string> = {
    get_user_accounts: 'Henter kontoer',
    get_existing_snapshots: 'Henter eksisterende data',
    upsert_snapshot: 'Lagrer måned',
  };
  return names[tool] || tool;
}

/**
 * Get tool icon
 */
function getToolIcon(tool: string): string {
  const icons: Record<string, string> = {
    get_user_accounts: '👤',
    get_existing_snapshots: '📊',
    upsert_snapshot: '💾',
  };
  return icons[tool] || '🔧';
}

/**
 * Format action output for display
 */
function formatOutput(action: AgentAction): string {
  if (!action.output) return '';

  const output = action.output as Record<string, unknown>;

  if (action.tool === 'upsert_snapshot') {
    const result = output as { action: string; date: string; totalNetWorth: number };
    const actionText = result.action === 'created' ? 'Opprettet' : 'Oppdatert';
    return `${actionText} ${result.date}`;
  }

  if (action.tool === 'get_user_accounts') {
    const result = output as { accounts: unknown[] };
    return `${result.accounts?.length || 0} kontoer funnet`;
  }

  if (action.tool === 'get_existing_snapshots') {
    const result = output as { snapshots: unknown[] };
    return `${result.snapshots?.length || 0} måneder funnet`;
  }

  return JSON.stringify(output).substring(0, 50);
}

/**
 * AgentActions Component
 *
 * Displays a collapsible list of agent tool calls
 */
function AgentActions({ actions }: { actions: AgentAction[] }) {
  const [expanded, setExpanded] = useState(false);

  // Filter to only show tool_result actions (they have the output)
  const toolResults = actions.filter((a) => a.type === 'tool_result');

  if (toolResults.length === 0) return null;

  // Count by type
  const upsertCount = toolResults.filter((a) => a.tool === 'upsert_snapshot').length;

  return (
    <div className="agent-actions">
      <button
        className="agent-actions__toggle"
        onClick={() => setExpanded(!expanded)}
        type="button"
        aria-expanded={expanded}
      >
        <span className="agent-actions__summary">
          {upsertCount > 0 ? `${upsertCount} måneder behandlet` : `${toolResults.length} handlinger`}
        </span>
        <span className="agent-actions__chevron">›</span>
      </button>

      {expanded && (
        <ul className="agent-actions__list">
          {toolResults.map((action, idx) => (
            <li key={idx} className="agent-actions__item">
              <span className="agent-actions__icon">{getToolIcon(action.tool || '')}</span>
              <span className="agent-actions__name">{formatToolName(action.tool || '')}</span>
              <span className="agent-actions__result">{formatOutput(action)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const hasActions = message.actions && message.actions.length > 0;

  return (
    <div className={`chat-message chat-message--${message.role}`}>
      <div className="chat-message__content">
        {message.content}
      </div>

      {/* Show agent actions for assistant messages */}
      {message.role === 'assistant' && hasActions && (
        <AgentActions actions={message.actions!} />
      )}

      {/* Show stats badge */}
      {message.stats && (message.stats.snapshotsCreated > 0 || message.stats.snapshotsUpdated > 0) && (
        <div className="chat-message__stats">
          {message.stats.snapshotsCreated > 0 && (
            <span className="chat-message__stat chat-message__stat--created">
              +{message.stats.snapshotsCreated} nye
            </span>
          )}
          {message.stats.snapshotsUpdated > 0 && (
            <span className="chat-message__stat chat-message__stat--updated">
              {message.stats.snapshotsUpdated} oppdatert
            </span>
          )}
        </div>
      )}
    </div>
  );
}
