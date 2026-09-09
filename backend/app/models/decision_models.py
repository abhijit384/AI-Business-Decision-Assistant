from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class DecisionRequest(BaseModel):
    decision: str = Field(..., min_length=5, max_length=1000, description="The business decision to evaluate")
    industry: str = Field(..., min_length=2, max_length=100, description="Industry or market domain")
    company_size: str = Field(..., description="Startup, Small, Medium, or Enterprise")
    budget: Optional[float] = Field(default=0.0, ge=0, description="Allocated budget in USD or local currency")
    timeline: str = Field(..., description="Expected decision timeframe (e.g. 1 month, 3 months, 1 year)")
    risk_tolerance: str = Field(..., description="Risk tolerance level: Low, Medium, High")
    additional_context: Optional[str] = Field(default="", max_length=2000, description="Optional extra context or business constraints")

    @field_validator("decision")
    @classmethod
    def validate_decision(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Decision description cannot be empty or whitespace.")
        return v


class AlternativeOption(BaseModel):
    option: str = Field(..., description="Alternative strategic decision or approach")
    tradeoff: str = Field(..., description="Trade-off, sacrifice, or constraint of this alternative")


class DecisionResponse(BaseModel):
    recommendation: str = Field(..., description="Primary clear, actionable strategic recommendation")
    reasoning: str = Field(..., description="Detailed analytical justification for this recommendation")
    pros: List[str] = Field(default_factory=list, description="List of key advantages and benefits")
    cons: List[str] = Field(default_factory=list, description="List of critical risks, downsides, and vulnerabilities")
    alternatives: List[AlternativeOption] = Field(default_factory=list, description="2-3 viable counter-strategies with trade-offs")
    confidence_score: int = Field(..., ge=0, le=100, description="Confidence percentage score (0-100)")
    risk_level: str = Field(..., description="Assessed risk level: Low, Medium, or High")
