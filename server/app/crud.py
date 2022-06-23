from sqlalchemy.orm import Session
from datetime import datetime

from . import models, schemas

from .sentiment import predict_rating
from .credibility import get_credibility_by_review


def get_places_by_word(db: Session, word: str):
    return db.query(models.Review).distinct(models.Review.place).group_by(models.Review.place).filter(models.Review.place.like(f'%{word}%')).limit(10).all()


def get_reviews_by_place(db: Session, place: str):
    return db.query(models.Review).filter(models.Review.place == place).all()


def get_reviews_by_user(db: Session, user: str):
    return db.query(models.Review).filter(models.Review.user == user).all()


def create_review(db: Session, review: schemas.ReviewCreate):
    credibility = get_credibility_by_review(review.comment, review.rating)
    created_at = datetime.now()
    db_review = models.Review(user=review.user,
                              place=review.place,
                              comment=review.comment,
                              rating=review.rating,
                              credibility=credibility,
                              created_at=created_at)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
