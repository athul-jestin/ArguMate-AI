import { Send } from 'lucide-react';
import { useState } from 'react';
import './InitialPrompt.css';

interface InitialPromptProps {
  onStartDebate: (topic: string, points: string[]) => void;
  isLoading?: boolean;
}

export function InitialPrompt({ onStartDebate, isLoading = false }: InitialPromptProps) {
  const [topic, setTopic] = useState('');
  const [points, setPoints] = useState('');

  const handleSubmit = () => {
    if (topic.trim() && points.trim()) {
      const pointsList = points
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      onStartDebate(topic, pointsList);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="initial-prompt">
      <div className="prompt-container">
        <div className="prompt-header">
          <h1>ArguMate AI</h1>
          <p>Start a new debate by entering a topic and key discussion points</p>
        </div>

        <div className="prompt-form">
          <div className="form-group">
            <label htmlFor="topic">Debate Topic</label>
            <input
              id="topic"
              type="text"
              placeholder="e.g., Should artificial intelligence replace human workers?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="points">Discussion Points (one per line)</label>
            <textarea
              id="points"
              placeholder={`e.g., Impact on employment\nEconomic benefits\nEthical considerations\nSkill evolution`}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={6}
            />
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading || !topic.trim() || !points.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Starting debate...
              </>
            ) : (
              <>
                <Send size={18} />
                Start Debate
              </>
            )}
          </button>
        </div>

        <div className="prompt-tips">
          <h3>Tips for better debates:</h3>
          <ul>
            <li>Choose controversial or nuanced topics for interesting debates</li>
            <li>List 3-5 key discussion points for well-rounded arguments</li>
            <li>Be specific - vague topics lead to less interesting debates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
