# app/routes/swagger.py

from flask import Blueprint
from flask_swagger_ui import get_swaggerui_blueprint

# Swagger UI 설정
SWAGGER_URL = '/swagger'  # Swagger UI URL
API_URL = '/static/swagger.json'  # Swagger 문서 URL (JSON 파일)

swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "BiblioBloom API"
    }
)

# Swagger UI Blueprint 생성
bp = Blueprint('swagger', __name__)

# Swagger UI를 app에 등록하는 함수
def add_swagger_ui_blueprint(app):
    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)
