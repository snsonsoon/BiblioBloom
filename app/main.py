from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.users import user_router  # assuming the router name from routes/users.py
from app.routes.statistics import statistics_router
from app.routes.books import book_router
from app.routes.reviews import review_router
from app.routes.libraries import library_router
from app.database.connection import conn
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

origins = ["http://localhost:3000"]
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

async def lifespan(app: FastAPI):
    # on start up
    conn()
    yield
    # on exit

app = FastAPI(root_path='/api', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 출처
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # 로그인과 회원가입 경로를 제외한 나머지 경로에만 인증 처리
    excluded_paths = ["/users/login", "/user/signup"]  # 로그인과 회원가입 경로
    
    if request.url.path in excluded_paths:
        return await call_next(request)  # 제외된 경로는 미들웨어 처리 없이 바로 응답 반환

    # 여기에 인증 처리 로직 추가
    token = request.cookies.get("access_token")
    if not token:
        return RedirectResponse(url="/login")  # 토큰이 없으면 로그인 페이지로 리다이렉트

    # 여기에 토큰 검증 로직 추가 (예시로만)
    try:
        # 예시: JWT 토큰 검증
        import jwt
        jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    except jwt.ExpiredSignatureError:
        return RedirectResponse(url=origins)  # 토큰 만료시 로그인 페이지로 리다이렉트
    except jwt.InvalidTokenError:
        return RedirectResponse(url=origins)  # 유효하지 않은 토큰일 경우 로그인 페이지로 리다이렉트

    # 인증이 통과하면 요청 처리
    response = await call_next(request)
    return response

@app.get("/")
def world():
    return {"hello world"}

app.include_router(user_router)
app.include_router(statistics_router)
app.include_router(book_router)
app.include_router(review_router)
app.include_router(library_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
