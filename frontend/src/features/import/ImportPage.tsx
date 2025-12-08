import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, PageHeader, Button } from '@finans/components';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useImportChat } from './useImportChat';
import { ChatMessage } from './ChatMessage';
import './ImportPage.css';

/**
 * Import Page Component
 *
 * Classic chatbot interface for importing portfolio data via LLM agent.
 * Users can paste data from Excel, text, or type directly.
 * The agent executes tools directly - no confirmation needed.
 */

export default function ImportPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    messages,
    isLoading,
    sendMessage,
    reset,
  } = useImportChat();
  usePageTitle('Importer');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleReset = () => {
    reset();
    setInput('');
  };

  return (
    <main className="import-page">
      <div className="import-page__header">
        <Breadcrumb
          items={[
            { label: 'Portefølje', path: '/portefolje' },
            { label: 'Importer data' },
          ]}
        />
        <PageHeader
          title="Importer data"
          subtitle="Lim inn data fra Excel eller skriv det selv"
        />
      </div>

      {/* Chat window */}
      <div className="chatbot">
        {/* Messages area */}
        <div className="chatbot__messages">
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="chatbot__typing">
                <span className="chatbot__typing-dot"></span>
                <span className="chatbot__typing-dot"></span>
                <span className="chatbot__typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="chatbot__input-area">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Lim inn data eller skriv en melding..."
            rows={1}
            disabled={isLoading}
            className="chatbot__input"
            aria-label="Skriv eller lim inn porteføljedata"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="chatbot__send"
            aria-label="Send melding"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Footer actions */}
      <div className="import-page__footer">
        <Button variant="secondary" onClick={() => navigate('/portefolje')}>
          Tilbake til portefølje
        </Button>
        {messages.length > 2 && (
          <Button variant="secondary" onClick={handleReset}>
            Ny samtale
          </Button>
        )}
      </div>
    </main>
  );
}
