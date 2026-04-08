import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { DebateMessage } from './DebateMessage';
import { FactChecker, type FactCheckResult } from './FactChecker';
import './ChatArea.css';

interface Message {
  type: 'debate' | 'fact-checker';
  agent?: 'Alpha' | 'Beta';
  content?: string | ClaimCheck[];
  timestamp?: Date;
}

interface ClaimCheck {
  agent: 'Alpha' | 'Beta';
  claim: string;
  result: FactCheckResult;
}

interface ChatAreaProps {
  messages: Message[];
  topic: string;
  isLoading?: boolean;
  onContinueDebate?: () => void;
  showContinueButton?: boolean;
}

export function ChatArea({
  messages = [],
  topic,
  isLoading = false,
  onContinueDebate,
  showContinueButton = false,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-area">
      {/* Topic Header */}
      {topic && (
        <div className="topic-header">
          <h2>{topic}</h2>
        </div>
      )}

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'debate' && msg.agent && msg.content && (
              <DebateMessage
                agent={msg.agent}
                message={msg.content as string}
                timestamp={msg.timestamp}
              />
            )}
            {msg.type === 'fact-checker' && (
              <FactChecker claims={msg.content as ClaimCheck[]} />
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Generating response...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Action Bar */}
      <div className="chat-actions">
        {showContinueButton && !isLoading && (
          <button className="continue-btn" onClick={onContinueDebate}>
            <Send size={18} />
            Continue Debate
          </button>
        )}
      </div>
    </div>
  );
}
