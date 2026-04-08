import './DebateMessage.css';

interface DebateMessageProps {
  agent: 'Alpha' | 'Beta';
  message: string;
  timestamp?: Date;
}

export function DebateMessage({ agent, message, timestamp }: DebateMessageProps) {
  const isAlpha = agent === 'Alpha';

  return (
    <div className={`debate-message ${isAlpha ? 'alpha' : 'beta'}`}>
      <div className="message-header">
        <span className={`agent-badge ${isAlpha ? 'alpha-badge' : 'beta-badge'}`}>
          {agent}
        </span>
        {timestamp && <span className="timestamp">{formatTime(timestamp)}</span>}
      </div>
      <div className={`message-content ${isAlpha ? 'alpha-content' : 'beta-content'}`}>
        {message}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
