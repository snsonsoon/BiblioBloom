from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.users import User
from flask_jwt_extended import create_access_token

# Flask Blueprint
bp = Blueprint('users', __name__)

# 회원가입 API
@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    nickname = data.get('nickname')

    # 필수 값 확인
    if not user_id or not password or not nickname:
        return jsonify({"error": "Missing required fields"}), 400

    # 유저 중복 확인
    if User.query.filter_by(user_id=user_id).first():
        return jsonify({"error": "User ID already exists"}), 409

    # 새로운 유저 생성
    new_user = User(user_id=user_id, nickname=nickname)
    new_user.set_password(password)  # 비밀번호 해시화
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# 로그인 API
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')

    # 필수 값 확인
    if not user_id or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # 유저 검색
    user = User.query.filter_by(user_id=user_id).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    # JWT 토큰 생성
    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token}), 200
