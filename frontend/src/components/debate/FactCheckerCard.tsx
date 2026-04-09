

export type Verdict = 'True' | 'False' | 'Partially True';

export interface Claim {
  text: string;
  verdict: Verdict;
}

interface FactCheckerCardProps {
  alphaClaims: Claim[];
  betaClaims: Claim[];
}

export function FactCheckerCard({ alphaClaims, betaClaims }: FactCheckerCardProps) {
  const getBadgeColor = (verdict: Verdict) => {
    switch (verdict) {
      case 'True': return 'bg-pro/10 text-pro border-pro/30';
      case 'False': return 'bg-con/10 text-con border-con/30';
      case 'Partially True': return 'bg-secondary/10 text-secondary border-secondary/30';
      default: return 'bg-fact/10 text-fact border-fact/30';
    }
  };

  const renderClaims = (claims: Claim[], side: string) => (
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-semibold text-foreground/70 tracking-wide uppercase">{side} Claims</h4>
      <div className="space-y-2">
        {claims.length === 0 && <div className="text-sm text-foreground/50 italic">No claims verified.</div>}
        {claims.map((claim, idx) => (
          <div key={idx} className="flex flex-col gap-2 text-sm bg-background/50 p-3 rounded-md border border-border">
            <div className="flex items-start">
              <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeColor(claim.verdict)}`}>
                {claim.verdict}
              </span>
            </div>
            <span className="text-foreground/90">{claim.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-6 px-4 md:px-0 w-full animate-in slide-in-from-bottom-2 fade-in duration-500">
      <div className="max-w-3xl border border-border rounded-lg bg-surface p-4 md:p-6 shadow-sm mx-auto w-full group hover:border-fact/30 transition-colors">
        <div className="flex items-center gap-3 border-b border-border pb-3 mb-2">
          <div className="w-7 h-7 rounded bg-fact/20 flex items-center justify-center text-fact font-bold text-xs">
            FC
          </div>
          <h3 className="font-semibold text-foreground">Fact-Checker</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {renderClaims(alphaClaims, 'Alpha (Pro)')}
          {renderClaims(betaClaims, 'Beta (Con)')}
        </div>
      </div>
    </div>
  );
}
