from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ReviewBase(BaseModel):
    user: str
    place: str
    comment: str
    rating: float


class ReviewCreate(ReviewBase):
    cluster: Optional[int]
    credibility: Optional[float]
    pass


class ReviewCreateErrorDetail(BaseModel):
    message: str
    cluster: int
    credibility: float


class ReviewCreateError(BaseModel):
    detail: ReviewCreateErrorDetail


class Review(ReviewBase):
    id: int
    credibility: float
    created_at: datetime
    cluster: Optional[int]

    class Config:
        orm_mode = True

