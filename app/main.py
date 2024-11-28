from fastapi import FastAPI
from app.routes.users import user_router  # assuming the router name from routes/users.py
from app.database.connection import conn
import uvicorn

app = FastAPI()

# Include the routers
app.include_router(user_router)

@app.get("/")
def world():
    return {"hello world"}


if __name__ == "__main__":
    conn()
    uvicorn.run(app, host="0.0.0.0", port=8000)
