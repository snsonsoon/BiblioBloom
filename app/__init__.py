from flask import Flask
from .routes import users, statistics  # 라우트 불러오기
from app.routes.swagger import register_swagger
from dotenv import load_dotenv
from .extensions import db, jwt
import os

def create_app():
    app = Flask(__name__)

    load_dotenv()

    # 환경 변수 또는 .env 파일을 통해 비밀 키 설정
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # DB 초기화
    db.init_app(app)
    jwt.init_app(app) 

    # 블루프린트 등록 (라우트)
    app.register_blueprint(users.bp)
    app.register_blueprint(statistics.bp)

    register_swagger(app)
    
    return app


