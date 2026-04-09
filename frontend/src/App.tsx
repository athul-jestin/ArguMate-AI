import { useState, useRef, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { InputBar } from './components/debate/InputBar';
import { MessageBubble, type AgentRole } from './components/debate/MessageBubble';
import { FactCheckerCard, type Claim } from './components/debate/FactCheckerCard';
import { TypingIndicator } from './components/debate/TypingIndicator';

// Types to represent the debate thread
type DebateItem = 
  | { type: 'topic'; content: string }
  | { type: 'message'; role: AgentRole; content: string }
  | { type: 'fact-check'; alphaClaims: Claim[]; betaClaims: Claim[] };

type DebateState = 'idle' | 'alpha_typing' | 'beta_typing' | 'fc_typing' | 'waiting_continue';

function App() {
  const [thread, setThread] = useState<DebateItem[]>([]);
  const [debateState, setDebateState] = useState<DebateState>('idle');
  const [topic, setTopic] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [thread, debateState]);

  const simulateTrip = async () => {
    // 1. Alpha typing
    setDebateState('alpha_typing');
    await new Promise(r => setTimeout(r, 1500));
    setThread(prev => [...prev, { 
      type: 'message', 
      role: 'alpha', 
      content: "Here is Alpha's argument for the Pro side. To start, I'd like to assert that adopting this approach provides immense long-term value, offsetting the initial costs.\n\nFirst, historical data shows a 45% increase in efficiency across similar implementations. Second, we cannot ignore the ethical imperative."
    }]);
    
    // 2. Beta typing
    setDebateState('beta_typing');
    await new Promise(r => setTimeout(r, 1500));
    setThread(prev => [...prev, { 
      type: 'message', 
      role: 'beta', 
      content: "Beta responding here for the Con side. Alpha's claims are optimistic but fail to account for edge cases.\n\nThe 45% efficiency metric is drawn from a flawed study. Moreover, the initial costs frequently lead to budget overruns that stall broader initiatives entirely."
    }]);

    // 3. Fact Checker typing
    setDebateState('fc_typing');
    await new Promise(r => setTimeout(r, 2000));
    setThread(prev => [...prev, { 
      type: 'fact-check',
      alphaClaims: [
        { text: "Historical data shows a 45% increase in efficiency.", verdict: 'Partially True' },
        { text: "Adopting this approach offsets initial costs.", verdict: 'True' }
      ],
      betaClaims: [
        { text: "The 45% efficiency metric is drawn from a flawed study.", verdict: 'False' },
        { text: "Initial costs lead to budget overruns.", verdict: 'Partially True' }
      ]
    }]);
    
    // 4. Sequence done
    setDebateState('waiting_continue');
  };

  const handleStartDebate = (newTopic: string) => {
    setTopic(newTopic);
    setThread([{ type: 'topic', content: newTopic }]);
    simulateTrip();
  };

  const handleContinue = () => {
    simulateTrip();
  };

  const handleNewDebate = () => {
    setTopic('');
    setThread([]);
    setDebateState('idle');
  };

  return (
    <MainLayout onNewDebate={handleNewDebate}>
      <div className="flex flex-col h-full items-center justify-between">
        {thread.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full px-4 animate-in fade-in zoom-in duration-500">
            <h1 className="text-3xl md:text-5xl font-bold mb-5 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent pb-1 tracking-tight">
              Start a New Debate
            </h1>
            <p className="text-foreground/60 text-center max-w-md text-sm md:text-base leading-relaxed">
              Enter a topic and describe the key points you'd like debated by the Pro and Con agents.
            </p>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-y-auto" ref={scrollRef}>
            {/* Top Bar Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 w-full flex justify-center">
              <h2 className="font-semibold text-lg truncate max-w-3xl text-center px-4 w-full text-foreground/90">
                {topic}
              </h2>
            </div>
            
            {/* Chat Thread */}
            <div className="w-full max-w-3xl mx-auto py-6 divide-y divide-border/30">
              {thread.map((item, i) => {
                if (item.type === 'message') {
                  return <MessageBubble key={i} role={item.role} content={item.content} />;
                } else if (item.type === 'fact-check') {
                  return <FactCheckerCard key={i} alphaClaims={item.alphaClaims} betaClaims={item.betaClaims} />;
                }
                return null;
              })}

              {debateState === 'alpha_typing' && <TypingIndicator />}
              {debateState === 'beta_typing' && <TypingIndicator />}
              {debateState === 'fc_typing' && <TypingIndicator />}

              {debateState === 'waiting_continue' && (
                <div className="py-8 flex justify-center animate-in fade-in duration-300">
                  <button 
                    onClick={handleContinue}
                    className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full font-semibold transition-colors"
                  >
                    Continue Debate
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full shrink-0">
          <InputBar 
            onSend={handleStartDebate} 
            disabled={debateState !== 'idle'} 
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
