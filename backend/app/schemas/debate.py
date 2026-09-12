from app.schemas.base import CamelModel


class TurnMessage(CamelModel):
    content: str
    role: str


class FactCheckClaim(CamelModel):
    claim: str
    verdict: str
    explanation: str


class FactCheckResult(CamelModel):
    alpha_claims: list[FactCheckClaim]
    beta_claims: list[FactCheckClaim]


class TurnResponse(CamelModel):
    trip_number: int
    alpha: TurnMessage
    beta: TurnMessage
    fact_checker: FactCheckResult
