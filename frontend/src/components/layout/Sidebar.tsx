import type { MouseEvent } from 'react';
import { Plus, MessageSquare, Trash2, LogOut } from 'lucide-react';

import { useAuth } from '@contexts/AuthContext';
import { useDeleteSession, useSessions } from '@hooks/useApi';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewDebate: () => void;
  onSelectSession: (sessionId: string) => void;
  activeSessionId: string | null;
}

export function Sidebar({ isOpen, setIsOpen, onNewDebate, onSelectSession, activeSessionId }: SidebarProps) {
  const { data: sessions, isLoading } = useSessions();
  const deleteSession = useDeleteSession();
  const { user, logout } = useAuth();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-[260px] bg-surface border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const handleSelect = (sessionId: string) => {
    onSelectSession(sessionId);
    setIsOpen(false);
  };

  const handleDelete = (e: MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession.mutate(sessionId);
    if (sessionId === activeSessionId) {
      onNewDebate();
    }
  };

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
          {!isLoading && (sessions?.length ?? 0) > 0 && (
            <div className="text-xs font-semibold text-fact px-3 mb-2 uppercase tracking-wider">
              Previous Debates
            </div>
          )}
          <div className="space-y-1">
            {isLoading && (
              <div className="px-3 py-3 text-sm text-foreground/40">Loading…</div>
            )}
            {sessions?.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors text-left ${
                  session.id === activeSessionId
                    ? 'bg-surface-hover text-foreground'
                    : 'text-foreground/80 hover:bg-surface-hover'
                }`}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate flex-1">{session.topic}</span>
                <span
                  onClick={(e) => handleDelete(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded hover:bg-con/20 hover:text-con transition-opacity"
                >
                  <Trash2 size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              {user?.username?.slice(0, 2).toUpperCase() ?? 'AM'}
            </div>
            <span className="font-semibold text-sm truncate">{user?.username ?? 'Argumate-AI'}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/60 hover:bg-surface-hover hover:text-foreground transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
