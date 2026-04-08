import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sidebar, ChatArea, InitialPrompt } from './components';
import './App.css';

interface ChatItem {
  id: string;
  title: string;
  timestamp: Date;
  topic: string;
  messages: Message[];
}

interface Message {
  type: 'debate' | 'fact-checker';
  agent?: 'Alpha' | 'Beta';
  content?: string | ClaimCheck[];
  timestamp?: Date;
}

interface ClaimCheck {
  agent: 'Alpha' | 'Beta';
  claim: string;
  result: 'True' | 'False' | 'Partially true';
}

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [chats, setChats] = useState<ChatItem[]>(() => {
    const saved = localStorage.getItem('argumate-chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('argumate-chats', JSON.stringify(chats));
  }, [chats]);

  const handleNewChat = () => {
    setActiveChat(null);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((c) => c.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(null);
    }
  };

  const handleStartDebate = async (topic: string, points: string[]) => {
    setIsLoading(true);

    try {
      // Create new chat
      const newChat: ChatItem = {
        id: Date.now().toString(),
        title: topic.substring(0, 50),
        timestamp: new Date(),
        topic,
        messages: [],
      };

      // Call backend API to start debate
      const response = await axios.post(`${API_BASE_URL}/debate/start`, {
        topic,
        discussion_points: points,
      });

      // Process response
      const messages: Message[] = [];

      // Add Alpha's opening statement
      if (response.data.alpha_opening) {
        messages.push({
          type: 'debate',
          agent: 'Alpha',
          content: response.data.alpha_opening,
          timestamp: new Date(),
        });
      }

      // Add Beta's response
      if (response.data.beta_response) {
        messages.push({
          type: 'debate',
          agent: 'Beta',
          content: response.data.beta_response,
          timestamp: new Date(),
        });
      }

      // Add fact-checker results
      if (response.data.fact_check) {
        const claims = parseFactCheckResults(response.data.fact_check, response.data);
        messages.push({
          type: 'fact-checker',
          content: claims,
        });
      }

      newChat.messages = messages;
      setChats([newChat, ...chats]);
      setActiveChat(newChat.id);
    } catch (error) {
      alert('Failed to start debate. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueDebate = async () => {
    const chat = chats.find((c) => c.id === activeChat);
    if (!chat) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/debate/continue`, {
        topic: chat.topic,
        chat_history: chat.messages,
      });

      const newMessages: Message[] = [...chat.messages];

      // Add new messages from response
      if (response.data.alpha_response) {
        newMessages.push({
          type: 'debate',
          agent: 'Alpha',
          content: response.data.alpha_response,
          timestamp: new Date(),
        });
      }

      if (response.data.beta_response) {
        newMessages.push({
          type: 'debate',
          agent: 'Beta',
          content: response.data.beta_response,
          timestamp: new Date(),
        });
      }

      if (response.data.fact_check) {
        const claims = parseFactCheckResults(response.data.fact_check, response.data);
        newMessages.push({
          type: 'fact-checker',
          content: claims,
        });
      }

      // Update chat
      setChats(
        chats.map((c) =>
          c.id === activeChat
            ? { ...c, messages: newMessages }
            : c
        )
      );
    } catch (error) {
      alert('Failed to continue debate.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseFactCheckResults = (
    factCheckData: any,
    _responseData: any
  ): ClaimCheck[] => {
    const claims: ClaimCheck[] = [];

    // Parse fact check data - this depends on your backend response format
    // Adjust based on actual API response structure
    if (factCheckData.alpha_claims) {
      factCheckData.alpha_claims.forEach((claim: any) => {
        claims.push({
          agent: 'Alpha',
          claim: claim.text || claim.claim || claim,
          result: claim.verdict || claim.result || 'Partially true',
        });
      });
    }

    if (factCheckData.beta_claims) {
      factCheckData.beta_claims.forEach((claim: any) => {
        claims.push({
          agent: 'Beta',
          claim: claim.text || claim.claim || claim,
          result: claim.verdict || claim.result || 'Partially true',
        });
      });
    }

    return claims;
  };

  const activeChatData = chats.find((c) => c.id === activeChat);

  return (
    <div className="app">
      <Sidebar
        chats={chats.map((c) => ({
          id: c.id,
          title: c.title,
          timestamp: c.timestamp,
        }))}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="app-container">
        {!activeChat ? (
          <InitialPrompt onStartDebate={handleStartDebate} isLoading={isLoading} />
        ) : (
          <ChatArea
            messages={activeChatData?.messages || []}
            topic={activeChatData?.topic || ''}
            isLoading={isLoading}
            onContinueDebate={handleContinueDebate}
            showContinueButton={
              !isLoading && activeChatData?.messages && activeChatData.messages.length > 0
            }
          />
        )}
      </div>
    </div>
  );
}

export default App;
