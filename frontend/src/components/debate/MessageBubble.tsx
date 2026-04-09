

export type AgentRole = 'alpha' | 'beta';

interface MessageBubbleProps {
  role: AgentRole;
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAlpha = role === 'alpha';
  
  return (
    <div className="flex gap-4 py-6 px-4 md:px-0 w-full animate-in fade-in duration-300">
      <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-sm ${isAlpha ? 'bg-pro/10 text-pro' : 'bg-con/10 text-con'}`}>
        {isAlpha ? 'α' : 'β'}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-semibold text-sm">
          {isAlpha ? 'Alpha — Pro' : 'Beta — Con'}
        </div>
        <div className="text-foreground/90 leading-relaxed max-w-prose whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
