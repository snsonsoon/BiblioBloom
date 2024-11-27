from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.statistics import UserStatisticsView, UserReviewGenres
from app.models.users import User
from sqlalchemy.sql import func

bp = Blueprint('statistics', __name__)

@bp.route('/user-statistics', methods=['GET'])
@jwt_required()  # JWT 인증
def user_statistics():
    user_id = get_jwt_identity()

    # 유저의 리뷰 개수
    user_stats = UserStatisticsView.query.filter_by(user_id=user_id).first()
    if not user_stats:
        return jsonify({"error": "No statistics available for this user"}), 404

    # 유저 리뷰 개수
    user_review_count = user_stats.total_reviews or 0

    # 유저의 리뷰 개수 상위 몇 %인지 계산
    total_users = db.session.query(func.count(User.user_id)).scalar()
    if total_users > 0:
        rank_percentage = (
            db.session.query(func.percent_rank().over(order_by=UserStatisticsView.total_reviews))
            .filter(UserStatisticsView.user_id == user_id)
            .scalar()
        ) * 100
    else:
        rank_percentage = 0

    return jsonify({
        "user_id": user_id,
        "total_reviews": user_review_count,
        "rank_percentage": rank_percentage
    })

@bp.route('/user-genre-ratios', methods=['GET'])
@jwt_required()  # JWT 인증
def user_genre_ratios():
    user_id = get_jwt_identity()

    # 유저가 리뷰 남긴 책의 장르 비율
    genre_data = UserReviewGenres.query.filter_by(user_id=user_id).all()

    if not genre_data:
        return jsonify({"error": "No genre data available for this user"}), 404

    total_reviews = sum([genre.review_count for genre in genre_data])
    genre_ratios = [
        {"genre": genre.genre, "ratio": genre.review_count / total_reviews * 100}
        for genre in genre_data
    ]

    return jsonify({
        "user_id": user_id,
        "genre_ratios": genre_ratios
    })