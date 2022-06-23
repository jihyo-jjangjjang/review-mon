from pydantic import BaseModel


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

    class Config:
        orm_mode = True

