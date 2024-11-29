from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database.connection import get_db, engine_url
from sqlalchemy import Table, MetaData
from ..schemas.statistics import UserStatisticsResponse, GenreRatioResponse, UserBooksRead
from typing import List

from sqlmodel import select


# Define the metadata and UserStatistics table for querying the view
metadata = MetaData()
UserStatistics = Table('UserStatistics', metadata, autoload_with=engine_url)
UserReviewGenres = Table('UserReviewGenres', metadata, autoload_with=engine_url)

statistics_router = APIRouter(prefix='/statistics', tags=["Statistics"])

# # 사용자 통계 API
# @statistics_router.get("/get_user_statistics/{user_id}", response_model=UserStatisticsResponse)
# async def get_user_statistics(user_id: str, db: Session = Depends(get_db)):
#     # UserStatistics 뷰를 직접 쿼리하여 결과를 가져옴
#     user_stat = db.execute(
#         UserStatistics.select().where(UserStatistics.c.user_id == user_id)
#     ).fetchone()

#     if not user_stat:
#         raise HTTPException(status_code=404, detail="User not found")

#     # 튜플에서 값을 인덱스로 접근
#     return {
#         "user_id": user_stat[0],  # user_id는 첫 번째 요소
#         "average_rating": float(user_stat[1]),  # Decimal 값을 float로 변환하여 반환
#         "total_reviews": user_stat[2]  # total_reviews는 세 번째 요소
#     }

@statistics_router.get("/get_user_review_statistics/{user_id}", response_model=UserStatisticsResponse) 
async def get_user_review_statistics(user_id: str, db: Session = Depends(get_db)):
    # 총 사용자 통계 조회 후 리뷰 수 기준으로 내림차순 정렬
    print(user_id)
    query = select(UserStatistics).order_by(UserStatistics.c.total_reviews.desc())  # UserStatistics의 컬럼을 명시적으로 선택
    total_reviews = db.execute(query).fetchall()  # 모든 사용자의 통계를 가져옵니다

    # 특정 사용자 통계 조회
    user_stat_query = select(UserStatistics).where(UserStatistics.c.user_id == user_id)  # 'user_id'를 정확히 필드로 사용
    user_stat_tuple = db.execute(user_stat_query).fetchone()

    if not user_stat_tuple:
        raise HTTPException(status_code=404, detail="User not found")

    user_stat = user_stat_tuple._mapping  # 반환된 튜플을 딕셔너리로 변환

    # 사용자 순위 계산
    user_rank = next((index for index, value in enumerate(total_reviews) if value._mapping["user_id"] == user_id), -1)

    if user_rank == -1:
        raise HTTPException(status_code=404, detail="User not found in total reviews")

    total_users = len(total_reviews)
    percentile = (user_rank / total_users) * 100

    print({
        "user_id": user_stat["user_id"],
        "average_rating": float(user_stat["average_rating"]),
        "total_reviews": user_stat["total_reviews"],
        "percentile": percentile
    }
)

    return {
        "user_id": user_stat["user_id"],
        "average_rating": float(user_stat["average_rating"]),
        "total_reviews": user_stat["total_reviews"],
        "percentile": percentile
    }

@statistics_router.get('/get_genre_ratio/{user_id}', response_model=GenreRatioResponse)
async def get_genre_ratio(user_id: str, db: Session = Depends(get_db)):
    # userreviewgenres 뷰에서 유저의 장르 및 리뷰 개수 가져오기
    print("------------------------------------------")
    print(user_id)
    print("------------------------------------------")
    stmt = select(UserReviewGenres.c.genre, UserReviewGenres.c.review_count).where(UserReviewGenres.c.user_id == user_id)
    results = db.execute(stmt).fetchall()

    if not results:
        raise HTTPException(status_code=404, detail="No genre data found for user")
    
    # 총 리뷰 개수 계산
    total_reviews = sum(result[1] for result in results)
    
    # 장르 비율 계산
    genre_ratio = {result[0]: result[1] / total_reviews * 100 for result in results}

    print({"user_id": user_id, "genre_ratio": genre_ratio})
    return {"user_id": user_id, "genre_ratio": genre_ratio}

@statistics_router.get('/top_users_by_books_read', response_model=List[UserBooksRead])
async def get_top_users_by_books_read(db: Session = Depends(get_db)):
    # Query the userstatistics view to get the top 3 users by total_reviews
    result = db.execute(
        UserStatistics.select().order_by(UserStatistics.c.total_reviews.desc())
    ).fetchmany(3)

    if not result:
        raise HTTPException(status_code=404, detail="No user statistics found")
    
    top_users = []
    for user_stat in result:
        top_users.append({"user_id": user_stat[0], "books_read_count": user_stat[2]})
    print(top_users)
    return top_users