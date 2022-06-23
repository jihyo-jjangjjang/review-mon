from typing import List
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import locale

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

locale.setlocale(locale.LC_TIME, 'ko_KR.UTF-8')

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/place/{word}", response_model=List[schemas.Review], response_model_include=["place"])
def get_places_by_word(word: str, db: Session = Depends(get_db)):
    return crud.get_places_by_word(db=db, word=word)


@app.post("/review", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db=db, review=review)


@app.get("/review/place/{place}", response_model=List[schemas.Review])
def get_reviews_by_place(place: str, db: Session = Depends(get_db)):
    return crud.get_reviews_by_place(db=db, place=place)


@app.get("/review/user/{user}", response_model=List[schemas.Review])
def get_reviews_by_user(user: str, db: Session = Depends(get_db)):
    return crud.get_reviews_by_user(db=db, user=user)


@app.get('/tag/user/{user}', response_model=str)
def get_tag_by_user(user: str, db: Session = Depends(get_db)):
    return crud.get_tag_by_user(db=db, user=user)