import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { MainLayout } from '@components/layout/MainLayout'
import { InputBar } from '@components/debate/InputBar'
import { MessageBubble, type AgentRole } from '@components/debate/MessageBubble'
import { FactCheckerCard, type Claim } from '@components/debate/FactCheckerCard'
import { TypingIndicator } from '@components/debate/TypingIndicator'
import { useCreateSession, usePostTurn } from '@hooks/useApi'
import { sessionsService } from '@services/sessions'
import type { Message } from '@apptypes/index'

type DebateItem =
  | { type: 'topic'; content: string }
  | { type: 'message'; role: AgentRole; content: string }
  | { type: 'fact-check'; alphaClaims: Claim[]; betaClaims: Claim[] }

type DebateState = 'idle' | 'loading' | 'waiting_continue'

interface RawFactCheckClaim {
  claim: string
  verdict: Claim['verdict']
  explanation?: string
}

function toClaim(c: RawFactCheckClaim): Claim {
  return { text: c.explanation ? `${c.claim} — ${c.explanation}` : c.claim, verdict: c.verdict }
}

function mapMessagesToThread(messages: Message[]): DebateItem[] {
  const byTrip = new Map<number, Message[]>()
  for (const m of messages) {
    const group = byTrip.get(m.tripNumber) ?? []
    group.push(m)
    byTrip.set(m.tripNumber, group)
  }

  const items: DebateItem[] = []
  const trips = [...byTrip.keys()].sort((a, b) => a - b)

  for (const trip of trips) {
    const group = byTrip.get(trip) ?? []
    const alpha = group.find((m) => m.role === 'alpha')
    const beta = group.find((m) => m.role === 'beta')
    const factChecker = group.find((m) => m.role === 'fact_checker')

    if (alpha) items.push({ type: 'message', role: 'alpha', content: alpha.content })
    if (beta) items.push({ type: 'message', role: 'beta', content: beta.content })
    if (factChecker) {
      try {
        const parsed = JSON.parse(factChecker.content) as {
          alpha_claims: RawFactCheckClaim[]
          beta_claims: RawFactCheckClaim[]
        }
        items.push({
          type: 'fact-check',
          alphaClaims: parsed.alpha_claims.map(toClaim),
          betaClaims: parsed.beta_claims.map(toClaim),
        })
      } catch {
        // malformed fact-check payload, skip rendering it
      }
    }
  }

  return items
}

export default function Debate() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [thread, setThread] = useState<DebateItem[]>([])
  const [debateState, setDebateState] = useState<DebateState>('idle')
  const [topic, setTopic] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const createSession = useCreateSession()
  const postTurn = usePostTurn()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [thread, debateState])

  const runTurn = async (sessionId: string) => {
    setDebateState('loading')
    try {
      const turn = await postTurn.mutateAsync(sessionId)
      setThread((prev) => [
        ...prev,
        { type: 'message', role: 'alpha', content: turn.alpha.content },
        { type: 'message', role: 'beta', content: turn.beta.content },
        {
          type: 'fact-check',
          alphaClaims: turn.factChecker.alphaClaims.map(toClaim),
          betaClaims: turn.factChecker.betaClaims.map(toClaim),
        },
      ])
      setDebateState('waiting_continue')
    } catch {
      toast.error('Could not generate the next turn. Please try again.')
      setDebateState('waiting_continue')
    }
  }

  const handleStartDebate = async (newTopic: string) => {
    setTopic(newTopic)
    setThread([{ type: 'topic', content: newTopic }])
    try {
      const session = await createSession.mutateAsync({ topic: newTopic })
      setActiveSessionId(session.id)
      await runTurn(session.id)
    } catch {
      toast.error('Could not start the debate. Please try again.')
      setDebateState('idle')
    }
  }

  const handleContinue = () => {
    if (activeSessionId) {
      runTurn(activeSessionId)
    }
  }

  const handleNewDebate = () => {
    setTopic('')
    setThread([])
    setActiveSessionId(null)
    setDebateState('idle')
  }

  const handleSelectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId)
    setDebateState('loading')
    try {
      const session = await sessionsService.get(sessionId)
      setTopic(session.topic)
      setThread([{ type: 'topic', content: session.topic }, ...mapMessagesToThread(session.messages)])
      setDebateState('waiting_continue')
    } catch {
      toast.error('Could not load that debate.')
      setDebateState('idle')
    }
  }

  return (
    <MainLayout onNewDebate={handleNewDebate} onSelectSession={handleSelectSession} activeSessionId={activeSessionId}>
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
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 w-full flex justify-center">
              <h2 className="font-semibold text-lg truncate max-w-3xl text-center px-4 w-full text-foreground/90">
                {topic}
              </h2>
            </div>

            <div className="w-full max-w-3xl mx-auto py-6 divide-y divide-border/30">
              {thread.map((item, i) => {
                if (item.type === 'message') {
                  return <MessageBubble key={i} role={item.role} content={item.content} />
                } else if (item.type === 'fact-check') {
                  return <FactCheckerCard key={i} alphaClaims={item.alphaClaims} betaClaims={item.betaClaims} />
                }
                return null
              })}

              {debateState === 'loading' && <TypingIndicator />}

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
          <InputBar onSend={handleStartDebate} disabled={debateState !== 'idle'} />
        </div>
      </div>
    </MainLayout>
  )
}
