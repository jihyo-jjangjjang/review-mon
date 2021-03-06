from sqlalchemy.orm import Session
from datetime import datetime
import pytz
from fastapi import HTTPException

from . import models, schemas

from .sentiment import predict_rating
from .credibility import get_cluster_and_credibility_by_review, get_cluster_by_user_reviews


def get_places_by_word(db: Session, word: str):
    return db.query(models.Review).distinct(models.Review.place).group_by(models.Review.place).filter(models.Review.place.like(f'%{word}%')).order_by(models.Review.place.asc()).limit(10).all()


def get_reviews_by_place(db: Session, place: str):
    return db.query(models.Review).filter(models.Review.place == place).order_by(models.Review.created_at.desc()).all()


def get_reviews_by_user(db: Session, user: str):
    return db.query(models.Review).filter(models.Review.user == user).order_by(models.Review.created_at.desc()).all()
    
    
def get_tag_by_user(db: Session, user: str):
    reviews = db.query(models.Review).filter(models.Review.user == user).all()
    if len(reviews) > 0:
        if reviews[0].cluster is None:
            cluster = get_cluster_by_user_reviews(reviews)
            if cluster == 0:
                tag = '응애'
            elif cluster == 1:
                tag = '언어의 마술사'
            elif cluster == 2:
                tag = '긴 말은 안한다'
            elif cluster == 3:
                tag = '모든 램지'
            elif cluster == 4:
                tag = '박찬호'
            else:
                tag = '아낌없이 주는 사람'
            db.query(models.Review).filter(models.Review.user == user).update({'cluster': cluster, 'tag': tag})
            db.commit()
        else:
            cluster = reviews[0].cluster
        if cluster == 0:
            return '응애'
        elif cluster == 1:
            return '언어의 마술사'
        elif cluster == 2:
            return '긴 말은 안한다'
        elif cluster == 3:
            return '모든 램지'
        elif cluster == 4:
            return '박찬호'
        else:
            return '아낌없이 주는 사람'
    else:
        return '아직 리뷰가 더 필요해요'


def create_review(db: Session, review: schemas.ReviewCreate):
    cluster, credibility = get_cluster_and_credibility_by_review(db, review)
    if cluster == 0:
        tag = '응애'
    elif cluster == 1:
        tag = '언어의 마술사'
    elif cluster == 2:
        tag = '긴 말은 안한다'
    elif cluster == 3:
        tag = '모든 램지'
    elif cluster == 4:
        tag = '박찬호'
    else:
        tag = '아낌없이 주는 사람'

    if credibility < 80:
        raise HTTPException(status_code=400, detail={
            'message': '신뢰도가 낮습니다.',
            'cluster': str(cluster),
            'credibility': str(credibility)
        })

    created_at = datetime.now(tz=pytz.timezone('Asia/Seoul'))
    db_review = models.Review(user=review.user,
                              place=review.place,
                              comment=review.comment,
                              rating=review.rating,
                              credibility=credibility,
                              created_at=created_at,
                              cluster=cluster,
                              tag=tag)
    db.add(db_review)
    db.query(models.Review).filter(models.Review.user == review.user).update({'cluster': cluster})
    db.commit()
    db.refresh(db_review)
    return db_review


def create_review_direct(db: Session, review: schemas.ReviewCreate):
    created_at = datetime.now(tz=pytz.timezone('Asia/Seoul'))
    cluster = review.cluster
    if cluster == 0:
        tag = '응애'
    elif cluster == 1:
        tag = '언어의 마술사'
    elif cluster == 2:
        tag = '긴 말은 안한다'
    elif cluster == 3:
        tag = '모든 램지'
    elif cluster == 4:
        tag = '박찬호'
    else:
        tag = '아낌없이 주는 사람'
    db_review = models.Review(user=review.user,
                              place=review.place,
                              comment=review.comment,
                              rating=review.rating,
                              credibility=review.credibility,
                              created_at=created_at,
                              cluster=cluster,
                              tag=tag)
    db.add(db_review)
    db.query(models.Review).filter(models.Review.user == review.user).update({'cluster': review.cluster})
    db.commit()
    db.refresh(db_review)
    return db_review