import pandas as pd
from konlpy.tag import *
import joblib

from . import models
from .sentiment import predict_pn


def degree_cal(rate):
    if rate == 1 or rate == 5:
        return 3
    elif rate == 2 or rate == 4:
        return 2
    else:
        return 1


# N, V 비율 알려주는 함수
def NV_count(each_result):
    Nnum = 0
    Vnum = 0
    total = 0
    for element in each_result:
        total += 1
        if element[1] == 'Noun':
            Nnum += 1
        elif element[1][0] == 'V':
            Vnum += 1
    if total == 0:
        return '-1', '-1'
    return round(Nnum / total * 100, 2), round(Vnum / total * 100, 2)


def get_cluster_and_credibility_by_review(db, review):
    twitter = Twitter()
    means = pd.DataFrame({
        '별점_평균': [3.6221],
        '별점_표준편차': [1.0520],
        '리뷰 개수': [8.4382],
        '리뷰 길이_평균': [61.0339],
        '리뷰 길이_표준편차': [34.4043],
        'degree_평균': [2.7113],
        '긍정 리뷰 개수': [5.4653],
        '긍부정 예측 일치 비율': [91.8587],
        'N 비율_평균': [41.5198],
        'N 비율_표준편차': [11.5032],
        'V 비율_평균': [13.2754],
        'V 비율_표준편차': [8.6737]
    })
    stds = pd.DataFrame({
        '별점_평균': [1.1935],
        '별점_표준편차': [0.8058],
        '리뷰 개수': [5.3840],
        '리뷰 길이_평균': [39.6636],
        '리뷰 길이_표준편차': [25.4387],
        'degree_평균': [0.3585],
        '긍정 리뷰 개수': [4.3945],
        '긍부정 예측 일치 비율': [14.5478],
        'N 비율_평균': [10.0669],
        'N 비율_표준편차': [8.4345],
        'V 비율_평균': [6.9313],
        'V 비율_표준편차': [6.0743]
    })

    user = review.user
    comment = review.comment
    rating = review.rating

    # search past reviews
    past_reviews = db.query(models.Review).filter(models.Review.user == user).all()
    if len(past_reviews) > 0:
        total_p = pd.DataFrame({
            '사용자 ID': [0 for _ in range(len(past_reviews) + 1)],
            '리뷰 내용': [r.comment for r in past_reviews] + [comment],
            '별점': [r.rating for r in past_reviews] + [rating]
        })
    else:
        total_p = pd.DataFrame({'사용자 ID': [0], '리뷰 내용': [comment], '별점': [rating]})

    total_p['리뷰 길이'] = total_p['리뷰 내용'].apply(lambda x: len(x))
    total_p['POS'] = total_p['리뷰 내용'].apply(lambda x: twitter.pos(x))

    total_p['degree'] = total_p['별점'].apply(lambda x: degree_cal(x))
    total_p['긍부정 예측_구분'] = predict_pn([comment])[0]

    total_p['별점_긍부정 구분'] = total_p['별점'].apply(lambda x: 1 if x > 3 else 0)
    total_p['긍부정 예측_성공'] = total_p['긍부정 예측_구분'] - total_p['별점_긍부정 구분']
    total_p['긍부정 예측_성공'] = total_p['긍부정 예측_성공'].apply(lambda x: 1 if x == 0 else 0)


    total_p['N 비율'] = total_p['POS'].apply(lambda x: float(NV_count(x)[0]))
    total_p['V 비율'] = total_p['POS'].apply(lambda x: float(NV_count(x)[1]))
    non = total_p.loc[total_p['N 비율'] == -1].index
    total_p = total_p.drop(non)

    # groupby
    reviewer = total_p.groupby('사용자 ID').aggregate(
        {'별점': ['mean', 'std'], '사용자 ID': 'count', '리뷰 길이': ['mean', 'std'], 'degree': 'mean', '별점_긍부정 구분': 'sum',
         '긍부정 예측_성공': 'sum', 'N 비율': ['mean', 'std'], 'V 비율': ['mean', 'std']})
    reviewer = reviewer.fillna(0)

    reviewer.columns = ['별점_평균', '별점_표준편차', '리뷰 개수', '리뷰 길이_평균', '리뷰 길이_표준편차',
                        'degree_평균', '긍정 리뷰 개수', '긍부정 예측 일치 비율',
                        'N 비율_평균', 'N 비율_표준편차', 'V 비율_평균', 'V 비율_표준편차']
    reviewer['긍부정 예측 일치 비율'] = reviewer['긍부정 예측 일치 비율'] / reviewer['리뷰 개수'] * 100

    reviewer.columns = ['별점_평균', '별점_표준편차', '리뷰 개수', '리뷰 길이_평균', '리뷰 길이_표준편차',
                        'degree_평균', '긍정 리뷰 개수', '긍부정 예측 일치 비율',
                        'N 비율_평균', 'N 비율_표준편차', 'V 비율_평균', 'V 비율_표준편차']
    reviewer['긍부정 예측 일치 비율'] = reviewer['긍부정 예측 일치 비율'] / reviewer['리뷰 개수'] * 100
    reviewer = reviewer.reset_index()
    reviewer = reviewer.drop(['사용자 ID'], axis=1)
    reviewer = (reviewer - means) / stds

    loaded_model = joblib.load('app/files/k_means.pkl')
    cluster = loaded_model.predict(reviewer)[0]

    if cluster == 3:
        x = 5
    elif cluster == 5:
        x = 3
    elif cluster == 4:
        x = 1
    elif cluster == 0:
        x = -1
    elif cluster == 2:
        x = -3
    else:
        x = -5

    rating_avg = reviewer.iloc[0, :]['별점_평균']
    if rating_avg < 2 or rating_avg > 4:
        y = -5
    elif rating_avg < 2.5 or rating_avg > 3.5:
        y = 5
    else:
        y = 0
    reviewer['군집신뢰점수'] = x
    reviewer['degree점수'] = y

    return cluster, 80 + reviewer.iloc[0, :]['degree점수'] + reviewer.iloc[0, :]['군집신뢰점수'] - reviewer.iloc[0, :]['N 비율_평균'] * 5 / 100 + reviewer.iloc[0, :]['V 비율_평균'] * 5 / 100

    # reviewer['조정 별점'] = reviewer['별점_평균'] * reviewer['신뢰도'] / 100


def get_cluster_by_user_reviews(reviews):
    twitter = Twitter()
    means = pd.DataFrame({
        '별점_평균': [3.6221],
        '별점_표준편차': [1.0520],
        '리뷰 개수': [8.4382],
        '리뷰 길이_평균': [61.0339],
        '리뷰 길이_표준편차': [34.4043],
        'degree_평균': [2.7113],
        '긍정 리뷰 개수': [5.4653],
        '긍부정 예측 일치 비율': [91.8587],
        'N 비율_평균': [41.5198],
        'N 비율_표준편차': [11.5032],
        'V 비율_평균': [13.2754],
        'V 비율_표준편차': [8.6737]
    })
    stds = pd.DataFrame({
        '별점_평균': [1.1935],
        '별점_표준편차': [0.8058],
        '리뷰 개수': [5.3840],
        '리뷰 길이_평균': [39.6636],
        '리뷰 길이_표준편차': [25.4387],
        'degree_평균': [0.3585],
        '긍정 리뷰 개수': [4.3945],
        '긍부정 예측 일치 비율': [14.5478],
        'N 비율_평균': [10.0669],
        'N 비율_표준편차': [8.4345],
        'V 비율_평균': [6.9313],
        'V 비율_표준편차': [6.0743]
    })

    total_p = pd.DataFrame({'사용자 ID': [0 for _ in range(len(reviews))], '리뷰 내용': [review.comment for review in reviews], '별점': [review.rating for review in reviews]})

    total_p['리뷰 길이'] = total_p['리뷰 내용'].apply(lambda x: len(x))
    total_p['POS'] = total_p['리뷰 내용'].apply(lambda x: twitter.pos(x))

    total_p['degree'] = total_p['별점'].apply(lambda x: degree_cal(x))
    total_p['긍부정 예측_구분'] = predict_pn([review.comment for review in reviews])

    total_p['별점_긍부정 구분'] = total_p['별점'].apply(lambda x: 1 if x > 3 else 0)
    total_p['긍부정 예측_성공'] = total_p['긍부정 예측_구분'] - total_p['별점_긍부정 구분']
    total_p['긍부정 예측_성공'] = total_p['긍부정 예측_성공'].apply(lambda x: 1 if x == 0 else 0)


    total_p['N 비율'] = total_p['POS'].apply(lambda x: float(NV_count(x)[0]))
    total_p['V 비율'] = total_p['POS'].apply(lambda x: float(NV_count(x)[1]))
    non = total_p.loc[total_p['N 비율'] == -1].index
    total_p = total_p.drop(non)

    # groupby
    reviewer = total_p.groupby('사용자 ID').aggregate(
        {'별점': ['mean', 'std'], '사용자 ID': 'count', '리뷰 길이': ['mean', 'std'], 'degree': 'mean', '별점_긍부정 구분': 'sum',
         '긍부정 예측_성공': 'sum', 'N 비율': ['mean', 'std'], 'V 비율': ['mean', 'std']})
    reviewer = reviewer.fillna(0)

    reviewer.columns = ['별점_평균', '별점_표준편차', '리뷰 개수', '리뷰 길이_평균', '리뷰 길이_표준편차',
                        'degree_평균', '긍정 리뷰 개수', '긍부정 예측 일치 비율',
                        'N 비율_평균', 'N 비율_표준편차', 'V 비율_평균', 'V 비율_표준편차']
    reviewer['긍부정 예측 일치 비율'] = reviewer['긍부정 예측 일치 비율'] / reviewer['리뷰 개수'] * 100

    reviewer.columns = ['별점_평균', '별점_표준편차', '리뷰 개수', '리뷰 길이_평균', '리뷰 길이_표준편차',
                        'degree_평균', '긍정 리뷰 개수', '긍부정 예측 일치 비율',
                        'N 비율_평균', 'N 비율_표준편차', 'V 비율_평균', 'V 비율_표준편차']
    reviewer['긍부정 예측 일치 비율'] = reviewer['긍부정 예측 일치 비율'] / reviewer['리뷰 개수'] * 100
    reviewer = reviewer.reset_index()
    reviewer = reviewer.drop(['사용자 ID'], axis=1)
    reviewer = (reviewer - means) / stds

    loaded_model = joblib.load('app/files/k_means.pkl')

    return loaded_model.predict(reviewer)[0]


