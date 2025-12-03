import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, PageHeader, Button } from '@finans/components';
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
            { label: 'Portefølje', path: '/portfolio' },
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
          {messages.length === 0 ? (
            <div className="chatbot__empty">
              <div className="chatbot__empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </div>
              <h3>Klar til å importere</h3>
              <p>Lim inn data fra Excel, nettbank eller skriv det selv. Agenten finner datoer og kontoer automatisk.</p>
            </div>
          ) : (
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
          )}
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
        <Button variant="secondary" onClick={() => navigate('/portfolio')}>
          Tilbake til portefølje
        </Button>
        {messages.length > 0 && (
          <Button variant="secondary" onClick={handleReset}>
            Ny samtale
          </Button>
        )}
      </div>
    </main>
  );
}
