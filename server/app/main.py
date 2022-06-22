from typing import List
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/review", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db=db, review=review)


@app.get("/review/place/{place}", response_model=List[schemas.Review])
def get_reviews_by_place(place: str, db: Session = Depends(get_db)):
    return crud.get_reviews_by_place(db=db, place=place)


@app.get("/review/user/{user}", response_model=List[schemas.Review])
def get_reviews_by_user(user: str, db: Session = Depends(get_db)):
    return crud.get_reviews_by_user(db=db, user=user)
