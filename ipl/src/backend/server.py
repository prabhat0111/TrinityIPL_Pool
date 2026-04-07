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
    # cur.execute("SELECT id, name, email FROM users WHERE id=%s", (user_id,))
    cur.execute("SELECT id, name, email, role FROM users WHERE id=%s", (user_id,))
    user = cur.fetchone()
    cur.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # return user
    return {
        "id": user[0],
        "name": user[1],
        "email": user[2],
        "role": user[3]
    }

def admin_required(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
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
        # cur.execute(
        #     "SELECT id, name, email, password_hash FROM users WHERE email=%s",
        #     (form_data.username,)
        # )
        cur.execute(
            "SELECT id, name, email, password_hash, role FROM users WHERE email=%s",
            (form_data.username,)
        )
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        # user_id, name, email, password_hash = user
        user_id, name, email, password_hash, role = user

        if not verify_password(form_data.password, password_hash):
            raise HTTPException(status_code=400, detail="Invalid password")

        access_token = create_access_token({
            "user_id": user_id,
            "email": email,
            "role": role
        })

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "role": role
            }
        }

    finally:
        cur.close()
        

@app.get("/leaderboard")
def leaderboard(user=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor()

    try:
        cur.execute("""
            SELECT u.name, COALESCE(SUM(p.points), 0) as total_points
            FROM users u
            LEFT JOIN picks p ON u.id = p.user_id
            WHERE u.role = 'user' 
            GROUP BY u.id
            ORDER BY total_points DESC
        """)

        rows = cur.fetchall()

        result = []
        rank = 1

        for row in rows:
            result.append({
                "rank": rank,
                "name": row[0],
                "points": row[1]
            })
            rank += 1

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
        cur.execute("""
            SELECT 
                m.id, m.team1, m.team2, m.match_time, m.result, m.status,
                p.selected_team
            FROM matches m
            LEFT JOIN picks p 
                ON m.id = p.match_id AND p.user_id = %s
            WHERE m.status = %s
            ORDER BY m.match_time
        """, (user["id"], status))
        matches = cur.fetchall()
        return [
            {
                "id": m[0],
                "team1": m[1],
                "team2": m[2],
                "match_time": m[3].isoformat(),
                "result": m[4],
                "status": m[5],
                "user_pick": m[6]  # 🔥 THIS FIXES EVERYTHING
            } for m in matches
        ]
    finally:
        cur.close()

# @app.on_event("startup")
# @repeat_every(seconds=10)  # runs every minute
# def update_match_status():
#     conn = pool.getconn()
#     cur = conn.cursor()
#     try:
#         # upcoming -> today
#         cur.execute(
#             "UPDATE matches SET status='today' WHERE status='upcoming' AND match_time::date = CURRENT_DATE"
#         )
#         # today -> live
#         cur.execute(
#             "UPDATE matches SET status='live' WHERE status='today' AND match_time <= NOW()"
#         )
#         conn.commit()
#     finally:
#         cur.close()
#         pool.putconn(conn)

@app.on_event("startup")
@repeat_every(seconds=10)
def update_match_status():
    conn = pool.getconn()
    cur = conn.cursor()

    try:
        # upcoming -> today
        cur.execute("""
            UPDATE matches 
            SET status='today' 
            WHERE status='upcoming' AND match_time::date = CURRENT_DATE
        """)

        # today -> live
        cur.execute("""
            UPDATE matches 
            SET status='live' 
            WHERE status='today' AND match_time <= NOW()
        """)

        # live -> completed (ONLY if result is set)
        cur.execute("""
            UPDATE matches 
            SET status='completed' 
            WHERE status='live' AND result IS NOT NULL
        """)

        # ✅ ASSIGN POINTS (IMPORTANT)
        # Give 1 point if user picked winning team
        cur.execute("""
            UPDATE picks p
            SET points = 1
            FROM matches m
            WHERE p.match_id = m.id
            AND m.status = 'completed'
            AND p.selected_team = m.result
        """)

        conn.commit()

    finally:
        cur.close()
        pool.putconn(conn)

@app.post("/pick")
def place_pick(data: dict, user=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor()

    try:
        user_id = user["id"]
        if user["role"] != "user":
            raise HTTPException(status_code=403, detail="Only users can place bets")
        match_id = data.get("match_id")
        selected_team = data.get("selected_team")

        # Check match
        cur.execute("SELECT status FROM matches WHERE id=%s", (match_id,))
        match = cur.fetchone()

        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        # ❌ No betting after match starts
        if match[0] != "today":
            raise HTTPException(status_code=400, detail="Betting closed")

        # ✅ Check if user already picked
        cur.execute(
            "SELECT id FROM picks WHERE user_id=%s AND match_id=%s",
            (user_id, match_id)
        )
        existing_pick = cur.fetchone()

        if existing_pick:
            # 🔁 UPDATE existing pick (ALLOW CHANGE)
            cur.execute(
                "UPDATE picks SET selected_team=%s WHERE user_id=%s AND match_id=%s",
                (selected_team, user_id, match_id)
            )
        else:
            # ➕ INSERT new pick
            cur.execute(
                "INSERT INTO picks (user_id, match_id, selected_team) VALUES (%s, %s, %s)",
                (user_id, match_id, selected_team)
            )

        db.commit()

        return {"message": "Pick saved/updated successfully"}

    finally:
        cur.close()

@app.get("/admin/test")
def admin_test(user=Depends(admin_required)):
    return {"message": f"Welcome Admin {user['name']}"}

@app.post("/admin/add-match")
def add_match(data: dict, user=Depends(admin_required), db=Depends(get_db)):
    cur = db.cursor()

    try:
        team1 = data.get("team1")
        team2 = data.get("team2")
        match_time = data.get("match_time")  # ISO format from frontend

        if not team1 or not team2 or not match_time:
            raise HTTPException(status_code=400, detail="Missing fields")

        # Convert string to datetime
        match_time = datetime.fromisoformat(match_time)

        # Get status from frontend (default = upcoming)
        status = data.get("status", "upcoming")

        # ✅ Only allow these statuses
        valid_status = ["upcoming", "today", "live"]

        if status not in valid_status:
            raise HTTPException(status_code=400, detail="Invalid status")

        cur.execute("""
            INSERT INTO matches (team1, team2, match_time, status)
            VALUES (%s, %s, %s, %s)
        """, (team1, team2, match_time, status))

        db.commit()

        return {"message": "Match added successfully"}

    finally:
        cur.close()

@app.get("/admin/get-users")
def get_users(user=Depends(admin_required), db=Depends(get_db)):
    cur = db.cursor()
    try:
        cur.execute("SELECT id, name, email, role FROM users")
        users = cur.fetchall()
        return [{"id": u[0], "name": u[1], "email": u[2], "role": u[3]} for u in users]
    finally:
        cur.close()
from fastapi import FastAPI, HTTPException, Depends
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/admin/add-user")
def add_user(data: dict, user=Depends(admin_required), db=Depends(get_db)):
    cur = db.cursor()
    try:
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "user")  # default role = user

        if not name or not email or not password:
            raise HTTPException(status_code=400, detail="Missing fields")

        # Hash password
        password_hash = pwd_context.hash(password)

        # Insert user
        cur.execute("""
            INSERT INTO users (name, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
        """, (name, email, password_hash, role))
        db.commit()

        return {"message": "User added successfully"}

    finally:
        cur.close()

@app.post("/admin/remove-user")
def remove_user(data: dict, user=Depends(admin_required), db=Depends(get_db)):
    cur = db.cursor()
    try:
        user_id = data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="Missing user_id")

        # Delete user
        cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
        db.commit()

        return {"message": "User removed successfully"}

    finally:
        cur.close()

# @app.post("/admin/enter-result")
# def enter_result(data: dict, user=Depends(admin_required), db=Depends(get_db)):
#     """
#     Admin updates the result of a match
#     """
#     cur = db.cursor()
#     try:
#         match_id = data.get("match_id")
#         result = data.get("result")  # should be team1 or team2

#         if not match_id or not result:
#             raise HTTPException(status_code=400, detail="Missing match_id or result")

#         # Check if match exists
#         cur.execute("SELECT team1, team2, status FROM matches WHERE id=%s", (match_id,))
#         match = cur.fetchone()
#         if not match:
#             raise HTTPException(status_code=404, detail="Match not found")

#         team1, team2, status = match

#         # Validate result
#         if result not in [team1, team2]:
#             raise HTTPException(status_code=400, detail="Result must be one of the playing teams")

#         # Update match result
#         cur.execute(
#             "UPDATE matches SET result=%s, status='completed' WHERE id=%s",
#             (result, match_id)
#         )

#         # Assign points to correct picks
#         cur.execute("""
#             UPDATE picks p
#             SET points = 1
#             FROM matches m
#             WHERE p.match_id = m.id
#             AND m.id=%s
#             AND p.selected_team = %s
#         """, (match_id, result))

#         db.commit()

#         return {"message": f"Match result updated to {result}"}

#     finally:
#         cur.close()


@app.post("/admin/enter-result")
def enter_result(data: dict, user=Depends(admin_required), db=Depends(get_db)):
    cur = db.cursor()
    try:
        match_id = data.get("match_id")
        result = data.get("result")

        if not match_id or not result:
            raise HTTPException(status_code=400, detail="Missing match_id or result")

        cur.execute("SELECT team1, team2, status FROM matches WHERE id=%s", (match_id,))
        match = cur.fetchone()
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        team1, team2, status = match
        if result not in [team1, team2]:
            raise HTTPException(status_code=400, detail="Result must be one of the playing teams")

        cur.execute(
            "UPDATE matches SET result=%s, status='completed' WHERE id=%s",
            (result, match_id)
        )

        cur.execute("""
            UPDATE picks p
            SET points = 1
            FROM matches m
            WHERE p.match_id = m.id
            AND m.id=%s
            AND p.selected_team = %s
        """, (match_id, result))

        db.commit()
        return {"message": f"Match result updated to {result}"}
    finally:
        cur.close()



@app.get("/profile")
def get_profile(user=Depends(get_current_user)):
    return {
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }

@app.post("/reset-password")
def reset_password(data: dict, user=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor()

    try:
        email = data.get("email")
        old_password = data.get("oldPassword")
        new_password = data.get("newPassword")

        if not email or not old_password or not new_password:
            raise HTTPException(status_code=400, detail="Missing fields")

        # Get user
        cur.execute(
            "SELECT id, password_hash FROM users WHERE email=%s",
            (email,)
        )
        user_data = cur.fetchone()

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        user_id, password_hash = user_data

        # Verify old password
        if not verify_password(old_password, password_hash):
            raise HTTPException(status_code=400, detail="Old password incorrect")

        # Hash new password
        new_hash = pwd_context.hash(new_password)

        # Update password
        cur.execute(
            "UPDATE users SET password_hash=%s WHERE id=%s",
            (new_hash, user_id)
        )

        db.commit()

        return {"message": "Password updated successfully"}

    finally:
        cur.close()

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False
    )