import { Check, AlertCircle, HelpCircle } from 'lucide-react';
import './FactChecker.css';

export type FactCheckResult = 'True' | 'False' | 'Partially true';

interface ClaimCheck {
  agent: 'Alpha' | 'Beta';
  claim: string;
  result: FactCheckResult;
}

interface FactCheckerProps {
  claims: ClaimCheck[];
}

export function FactChecker({ claims }: FactCheckerProps) {
  if (claims.length === 0) return null;

  return (
    <div className="fact-checker">
      <div className="fact-checker-header">
        <div className="header-icon">🔍</div>
        <h3>Fact Check Results</h3>
      </div>
      <div className="claims-list">
        {claims.map((claim, index) => (
          <div key={index} className={`claim-item ${claim.result.toLowerCase().replace(' ', '-')}`}>
            <div className="claim-icon">{getIcon(claim.result)}</div>
            <div className="claim-content">
              <div className="claim-agent">{claim.agent}'s claim:</div>
              <div className="claim-text">{claim.claim}</div>
            </div>
            <div className={`claim-result ${claim.result.toLowerCase().replace(' ', '-')}`}>
              {claim.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getIcon(result: FactCheckResult) {
  switch (result) {
    case 'True':
      return <Check size={20} className="icon-true" />;
    case 'False':
      return <AlertCircle size={20} className="icon-false" />;
    case 'Partially true':
      return <HelpCircle size={20} className="icon-partial" />;
  }
}
