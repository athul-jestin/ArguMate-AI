export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export type MessageRole = 'user' | 'alpha' | 'beta' | 'fact_checker'

export interface Message {
  id: string
  sessionId: string
  tripNumber: number
  role: MessageRole
  content: string
  createdAt: string
}

export interface SessionMinimal {
  id: string
  topic: string
  keyPoints: string | null
  createdAt: string
  updatedAt: string
}

export interface SessionFull extends SessionMinimal {
  messages: Message[]
}

export interface FactCheckClaim {
  claim: string
  verdict: 'True' | 'False' | 'Partially True'
  explanation: string
}

export interface FactCheckResult {
  alphaClaims: FactCheckClaim[]
  betaClaims: FactCheckClaim[]
}

export interface TurnResponse {
  tripNumber: number
  alpha: { content: string; role: string }
  beta: { content: string; role: string }
  factChecker: FactCheckResult
}
