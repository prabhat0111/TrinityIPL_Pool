from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.pool import SimpleConnectionPool
from datetime import datetime, date, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from config import settings
import os
import uvicorn
import pytz
from fastapi_utils.tasks import repeat_every

# ── Session management (JWT, cookies, refresh) ──
from session import (
    create_access_token,
    decode_token,
    extract_token,
    set_auth_cookie,
    clear_auth_cookie,
    attach_refreshed_token,
    oauth2_scheme,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

app = FastAPI()
CANADA_TZ = pytz.timezone("America/Toronto")
LAST_SYNC_TIME = datetime.now(CANADA_TZ)  # Global to track background task


ORIGINS = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
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


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def get_current_user(
    request: Request,
    response: Response,
    token: str | None = Depends(oauth2_scheme),
    db=Depends(get_db),
):
    """
    Extract and validate the JWT, look up the user in the DB,
    and auto-refresh the token/cookie if it's nearing expiry.
    """
    # 1. Extract token (header → cookie fallback)
    raw_token = token or request.cookies.get("access_token")
    if raw_token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # 2. Decode & validate
    payload = decode_token(raw_token)
    user_id = payload.get("user_id")

    # 3. DB lookup
    cur = db.cursor()
    cur.execute("SELECT id, name, email, role FROM users WHERE id=%s", (user_id,))
    user = cur.fetchone()
    cur.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # 4. Auto-refresh token if within refresh window
    new_token = attach_refreshed_token(response, payload)
    if new_token:
        # Store in request state so endpoints can return it in body if desired
        request.state.refreshed_token = new_token
    else:
        request.state.refreshed_token = None

    return {
        "id": user[0],
        "name": user[1],
        "email": user[2],
        "role": user[3],
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
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db),
):
    cur = db.cursor()
    try:
        cur.execute(
            "SELECT id, name, email, password_hash, role FROM users WHERE email=%s",
            (form_data.username,)
        )
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        user_id, name, email, password_hash, role = user

        if not verify_password(form_data.password, password_hash):
            raise HTTPException(status_code=400, detail="Invalid password")

        access_token = create_access_token({
            "user_id": user_id,
            "email": email,
            "role": role,
        })

        # Set httpOnly cookie with proper path
        set_auth_cookie(response, access_token)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "role": role,
            },
        }

    finally:
        cur.close()


@app.get("/verify")
def verify_session(
    request: Request,
    response: Response,
    user=Depends(get_current_user),
):
    """
    Lightweight endpoint the frontend calls on page load to check
    if the current token is still valid. Also triggers auto-refresh.
    Returns the user info and an optional refreshed token.
    """
    result = {
        "valid": True,
        "user": user,
    }
    refreshed = getattr(request.state, "refreshed_token", None)
    if refreshed:
        result["access_token"] = refreshed
    return result


@app.post("/logout")
def logout(response: Response):
    """
    Clear the auth cookie. The frontend should also remove localStorage token.
    """
    clear_auth_cookie(response)
    return {"message": "Logged out successfully"}


        

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
                "match_time": CANADA_TZ.localize(m[3]).isoformat(),
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
    global LAST_SYNC_TIME
    conn = pool.getconn()
    cur = conn.cursor()

    try:
        LAST_SYNC_TIME = datetime.now(CANADA_TZ)

        # upcoming -> today
        cur.execute("""
            UPDATE matches 
            SET status='today' 
            WHERE status='upcoming' AND match_time::date = (NOW() AT TIME ZONE 'America/Toronto')::date
        """)

        # today -> live
        cur.execute("""
            UPDATE matches 
            SET status='live' 
            WHERE status='today' AND match_time <= (NOW() AT TIME ZONE 'America/Toronto')
        """)

        # live -> completed (ONLY if result is set)
        cur.execute("""
            UPDATE matches 
            SET status='completed' 
            WHERE status='live' AND result IS NOT NULL
        """)

        # ✅ ASSIGN POINTS for matches with a winner only
        cur.execute("""
            UPDATE picks p
            SET points = 1
            FROM matches m
            WHERE p.match_id = m.id
            AND m.status = 'completed'
            AND m.result != 'No Result'
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
        nat_time = datetime.fromisoformat(match_time)
        canada_time = CANADA_TZ.localize(nat_time)
        # Get status from frontend (default = upcoming)
        status = data.get("status", "upcoming")

        # ✅ Only allow these statuses
        valid_status = ["upcoming", "today", "live"]

        if status not in valid_status:
            raise HTTPException(status_code=400, detail="Invalid status")

        cur.execute("""
            INSERT INTO matches (team1, team2, match_time, status)
            VALUES (%s, %s, %s, %s)
        """, (team1, team2, canada_time, status))

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
# (pwd_context is defined above — duplicate imports removed)

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
        if result not in [team1, team2, "No Result"]:
            raise HTTPException(status_code=400, detail="Result must be one of the playing teams or 'No Result'")

        cur.execute(
            "UPDATE matches SET result=%s, status='completed' WHERE id=%s",
            (result, match_id)
        )

        if result in [team1, team2]:
            # Normal case: winning team
            cur.execute("""
                UPDATE picks p
                SET points = 1
                FROM matches m
                WHERE p.match_id = m.id
                AND m.id=%s
                AND p.selected_team = %s
            """, (match_id, result))
        else:
            # No Result: everyone gets 0 points
            cur.execute("""
                UPDATE picks p
                SET points = 0
                WHERE p.match_id = %s
            """, (match_id,))


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


@app.get("/matches/{match_id}/picks")
def get_match_picks(match_id: int, user=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor()

    try:
        # ✅ Get picks ONLY for this match
        cur.execute("""
            SELECT u.name, p.selected_team
            FROM picks p
            JOIN users u ON u.id = p.user_id
            WHERE p.match_id = %s
        """, (match_id,))
        picks_data = cur.fetchall()

        picks = [
            {
                "username": row[0],
                "selected_team": row[1]
            }
            for row in picks_data
        ]

        # ✅ Get users who DID NOT pick
        cur.execute("""
            SELECT name FROM users 
            WHERE role='user' 
            AND id NOT IN (
                SELECT user_id FROM picks WHERE match_id = %s
            )
        """, (match_id,))
        no_pick_users = [row[0] for row in cur.fetchall()]

        return {
            "picks": picks,
            "no_pick_users": no_pick_users
        }

    finally:
        cur.close()

@app.get("/matches/{match_id}")
def get_match_by_id(match_id: int, user=Depends(get_current_user), db=Depends(get_db)):
    """
    Fetch a single match by ID
    """
    cur = db.cursor()
    try:
        cur.execute("""
            SELECT id, team1, team2, match_time, result, status
            FROM matches
            WHERE id = %s
        """, (match_id,))
        
        match = cur.fetchone()
        
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        
        return {
            "id": match[0],
            "team1": match[1],
            "team2": match[2],
            "match_time": CANADA_TZ.localize(match[3]).isoformat(),
            "result": match[4],
            "status": match[5]
        }
    finally:
        cur.close()

@app.get("/dashboard")
def get_dashboard(user=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor()

    try:
        user_id = user["id"]

        # 🔴 Pending (today & no pick)
        cur.execute("""
            SELECT m.id, m.team1, m.team2, m.match_time
            FROM matches m
            LEFT JOIN picks p 
                ON m.id = p.match_id AND p.user_id = %s
            WHERE m.status = 'today' AND p.id IS NULL
        """, (user_id,))

        pending = [
            {
                "id": r[0],
                "team1": r[1],
                "team2": r[2],
                "match_time": CANADA_TZ.localize(r[3]).isoformat() if r[3] else None
            }
            for r in cur.fetchall()
        ]
        # 📜 Past (ALL completed matches)
        cur.execute("""
            SELECT m.team1, m.team2, m.result, p.selected_team
            FROM matches m
            LEFT JOIN picks p 
                ON m.id = p.match_id AND p.user_id = %s
            WHERE m.status = 'completed'
            ORDER BY m.match_time DESC
        """, (user_id,))

        past = []
        correct = 0
        wrong = 0

        for r in cur.fetchall():
            team1, team2, result, selected = r

            if selected is None:
                status = "no_pick"
            elif result == "No Result":
                status = "no_result"
            elif selected == result:
                status = "win"
                correct += 1
            else:
                status = "lose"
                wrong += 1

            past.append({
                "team1": team1,
                "team2": team2,
                "status": status
            })

        # 🏆 Total points
        cur.execute("""
            SELECT COALESCE(SUM(points), 0)
            FROM picks
            WHERE user_id = %s
        """, (user_id,))
        points = cur.fetchone()[0]

        # 🏅 Rank
        cur.execute("""
            SELECT u.id, COALESCE(SUM(p.points), 0) as total_points
            FROM users u
            LEFT JOIN picks p ON u.id = p.user_id
            WHERE u.role = 'user'
            GROUP BY u.id
            ORDER BY total_points DESC
        """)

        rows = cur.fetchall()
        rank = 1
        user_rank = None

        for r in rows:
            if r[0] == user_id:
                user_rank = rank
                break
            rank += 1

        return {
            "pending": pending,
            "past": past,
            "points": points,
            "correct": correct,
            "wrong": wrong,
            "rank": user_rank,
            "last_sync": LAST_SYNC_TIME.isoformat()
        }


    finally:
        cur.close()

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False
    )