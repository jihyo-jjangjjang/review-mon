from pydantic import BaseModel
from datetime import datetime


class ReviewBase(BaseModel):
    user: str
    place: str
    comment: str
    rating: float


class ReviewCreate(ReviewBase):
    pass


class Review(ReviewBase):
    id: int
    credibility: float
    created_at: datetime
    cluster: int

    class Config:
        orm_mode = True

