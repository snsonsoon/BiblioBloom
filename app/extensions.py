from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# 확장 초기화
db = SQLAlchemy()
jwt = JWTManager()
