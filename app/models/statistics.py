from app.extensions import db

class UserStatisticsView(db.Model):
    __tablename__ = 'UserStatistics'  # 기존 뷰
    user_id = db.Column(db.String(50), primary_key=True)
    total_reviews = db.Column(db.Integer)
    average_rating = db.Column(db.Float)

class BookStatisticsView(db.Model):
    __tablename__ = 'BookStatistics'  # 기존 뷰
    isbn = db.Column(db.String(13), primary_key=True)
    total_reviews = db.Column(db.Integer)
    average_rating = db.Column(db.Float)

class UserReviewGenres(db.Model):
    __tablename__ = 'UserReviewGenres'  # 새로운 뷰 생성 필요
    user_id = db.Column(db.String(50), primary_key=True)
    genre = db.Column(db.String(50), primary_key=True)
    review_count = db.Column(db.Integer)
