from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.pool import SimpleConnectionPool
from datetime import datetime, date, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from config import settings
import os
import uvicorn
from fastapi_utils.tasks import repeat_every  # add at the top if not already


app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host=settings.DATABASE_HOST,
    database=settings.DATABASE_NAME,
    user=settings.DATABASE_USER,
    password=settings.DATABASE_PASSWORD,
    port=settings.DATABASE_PORT
)

def get_db():
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    cur = db.cursor()
    cur.execute("SELECT id, name, email FROM users WHERE id=%s", (user_id,))
    user = cur.fetchone()
    cur.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@app.get("/health")
def health():
    return {"status": "ok"}

# @app.get("/login")
# def login():
#     conn = pool.getconn()
#     try:
#         cur = conn.cursor()
#     finally:
#         cur.close()
#         pool.putconn(conn)

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    cur = db.cursor()

    try:
        cur.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email=%s",
            (form_data.username,)
        )
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        user_id, name, email, password_hash = user

        if not verify_password(form_data.password, password_hash):
            raise HTTPException(status_code=400, detail="Invalid password")

        access_token = create_access_token({
            "user_id": user_id,
            "email": email
        })

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }

    finally:
        cur.close()
        

@app.get("/leaderboard")
def get_leaderboard(user=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor()

    try:
        cur.execute("""
            SELECT name FROM users
            ORDER BY created_at DESC
            LIMIT 10;
        """)

        users = cur.fetchall()

        result = []
        for i, u in enumerate(users):
            result.append({
                "rank": i + 1,
                "name": u[0],
                "points": 10000 - (i * 500)  # temp
            })

        return result

    finally:
        cur.close()


@app.get("/matches")
def get_matches(status: str = "today", user=Depends(get_current_user), db=Depends(get_db)):
    """
    Fetch matches filtered by status: upcoming, today, live, completed
    """
    cur = db.cursor()
    try:
        cur.execute(
            "SELECT id, team1, team2, match_time, result, status FROM matches WHERE status=%s ORDER BY match_time",
            (status,)
        )
        matches = cur.fetchall()
        return [
            {
                "id": m[0],
                "team1": m[1],
                "team2": m[2],
                "match_time": m[3].isoformat(),
                "result": m[4],
                "status": m[5]
            } for m in matches
        ]
    finally:
        cur.close()

@app.on_event("startup")
@repeat_every(seconds=10)  # runs every minute
def update_match_status():
    conn = pool.getconn()
    cur = conn.cursor()
    try:
        # upcoming -> today
        cur.execute(
            "UPDATE matches SET status='today' WHERE status='upcoming' AND match_time::date = CURRENT_DATE"
        )
        # today -> live
        cur.execute(
            "UPDATE matches SET status='live' WHERE status='today' AND match_time <= NOW()"
        )
        conn.commit()
    finally:
        cur.close()
        pool.putconn(conn)
        
if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False
    )