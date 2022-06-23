from pydantic import BaseModel


class ReviewBase(BaseModel):
    user: str
    place: str
    comment: str
    rating: int


class ReviewCreate(ReviewBase):
    pass


class Review(ReviewBase):
    id: int
    credibility: int

    class Config:
        orm_mode = True

