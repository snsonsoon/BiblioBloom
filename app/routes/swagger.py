from flask import Blueprint, send_from_directory
from flask_swagger_ui import get_swaggerui_blueprint

# Swagger 설정
SWAGGER_URL = '/swagger'  # Swagger UI에 접근할 경로
API_URL = '/static/swagger.json'  # Swagger JSON 파일 경로

swagger_bp = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI URL
    API_URL,      # Swagger 파일 URL
    config={'app_name': "User Authentication API"}
)

bp = Blueprint('swagger', __name__)

# 정적 Swagger JSON 파일 제공
@bp.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# Flask 앱에 Swagger Blueprint 등록
def register_swagger(app):
    app.register_blueprint(swagger_bp, url_prefix=SWAGGER_URL)
    app.register_blueprint(bp)
