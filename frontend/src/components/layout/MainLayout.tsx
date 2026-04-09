import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  onNewDebate: () => void;
}

export function MainLayout({ children, onNewDebate }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onNewDebate={onNewDebate} />
      
      <main className="flex-1 flex flex-col h-full min-w-0 bg-background relative">
        <div className="md:hidden sticky top-0 z-10 flex items-center px-4 py-2 bg-background border-b border-border">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground/70 hover:text-foreground rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-2 font-semibold">Argumate-AI</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}
