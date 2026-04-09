

export function TypingIndicator() {
  return (
    <div className="flex gap-4 py-6 px-4 md:px-0 w-full animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-sm bg-surface text-foreground/50">
        ...
      </div>
      <div className="flex-1 flex gap-1 items-center h-8">
        <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
