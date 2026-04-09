import { Plus, MessageSquare } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewDebate: () => void;
}

export function Sidebar({ isOpen, setIsOpen, onNewDebate }: SidebarProps) {
  const mockSessions = [
    { id: 1, title: 'AI Automation vs Human Jobs', time: '2 hours ago' },
    { id: 2, title: 'Universal Basic Income', time: 'Yesterday' },
    { id: 3, title: 'Space Exploration Funding', time: 'Previous 7 Days' }
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-[260px] bg-surface border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-3">
          <button 
            onClick={onNewDebate}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-border hover:bg-surface-hover text-sm font-medium transition-colors text-primary"
          >
            <Plus size={16} />
            New Debate
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {mockSessions.length > 0 && (
            <div className="text-xs font-semibold text-fact px-3 mb-2 uppercase tracking-wider">
              Previous Debates
            </div>
          )}
          <div className="space-y-1">
            {mockSessions.map((session) => (
              <button 
                key={session.id}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-surface-hover text-sm text-foreground/80 transition-colors text-left"
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
              AM
            </div>
            <span className="font-semibold text-sm">Argumate-AI</span>
          </div>
        </div>
      </div>
    </>
  );
}
