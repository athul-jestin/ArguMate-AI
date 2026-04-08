import { Menu, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

interface ChatItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  chats: ChatItem[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={onToggle}>
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* New Chat Button */}
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <Plus size={16} />
            <span>New chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="chat-history">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <button
                  className="chat-item-content"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <MessageSquare size={16} />
                  <span className="chat-title">{chat.title}</span>
                </button>
                {hoveredChat === chat.id && (
                  <button
                    className="chat-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No chats yet</p>
              <p className="text-secondary">Start a new debate to get going</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <a href="https://github.com/athul-jestin/ArguMate-AI" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
}
