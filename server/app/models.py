from sqlalchemy import  Column, Integer, String

from .database import Base

class Review(Base):
    __tablename__ = "Review"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(100))
    place = Column(String(100))
    comment = Column(String(1000))
    rating = Column(Integer)
    credibility = Column(Integer)
