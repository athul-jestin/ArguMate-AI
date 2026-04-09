import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface InputBarProps {
  onSend: (topic: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      <div className="relative flex items-end bg-surface border border-border shadow-sm shadow-black/20 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Enter a debate topic and key points to discuss..."
          className="w-full max-h-[200px] bg-transparent border-0 focus:ring-0 outline-none resize-none py-4 pl-4 pr-12 text-foreground text-sm md:text-base leading-relaxed placeholder:text-foreground/40 disabled:opacity-50"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary text-primary-foreground disabled:bg-surface-hover disabled:text-foreground/40 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
      <div className="text-center text-xs text-foreground/40 mt-3 font-medium">
        Argumate-AI can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
}
