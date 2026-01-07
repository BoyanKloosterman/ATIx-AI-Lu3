from pydantic import BaseModel, Field
from typing import List, Optional


class RecommendRequest(BaseModel):
    # context (optioneel)
    study_year: Optional[int] = Field(None, ge=1, le=10)
    study_program: Optional[str] = Field(None, min_length=2, max_length=60)
    study_location: Optional[str] = Field(None, max_length=40)

    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    favorites: List[str] = Field(default_factory=list)

    # request-instellingen
    k: int = Field(5, ge=1, le=100)


class RecommendItem(BaseModel):
    id: int = Field(..., description="Module ID")
    name: str = Field(..., description="Module name")
    description: str = Field(default="", description="Module description")
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score")
    similarity_raw: Optional[float] = Field(None, description="Raw similarity score")
    location: str = Field(default="", description="Module location")
    studycredit: int = Field(default=0, description="Study credits")
    level: str = Field(default="", description="Module level")
    module_tags: str = Field(default="", description="Module tags")
    match_terms: List[str] = Field(default_factory=list, description="Matching terms")
    reason: str = Field(..., min_length=1, max_length=500, description="Recommendation reason")


class RecommendResponse(BaseModel):
    recommendations: List[RecommendItem]
