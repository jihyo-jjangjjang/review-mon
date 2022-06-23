from sqlalchemy.orm import Session

from . import models, schemas

from .sentiment import predict_rating


def get_places_by_word(db: Session, word: str):
    return db.query(models.Review).distinct(models.Review.place).group_by(models.Review.place).filter(models.Review.place.like(f'%{word}%')).all()


def get_reviews_by_place(db: Session, place: str):
    return db.query(models.Review).filter(models.Review.place == place).all()


def get_reviews_by_user(db: Session, user: str):
    return db.query(models.Review).filter(models.Review.user == user).all()


def create_review(db: Session, review: schemas.ReviewCreate):
    # TODO recalculate credibility
    credibility = abs(predict_rating(review.comment) - review.rating)
    db_review = models.Review(user=review.user,
                              place=review.place,
                              comment=review.comment,
                              rating=review.rating,
                              credibility=credibility)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
