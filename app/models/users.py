from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.String(50), primary_key=True, unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    nickname = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        """비밀번호를 해시화하여 저장"""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """비밀번호가 맞는지 확인"""
        return check_password_hash(self.password, password)
