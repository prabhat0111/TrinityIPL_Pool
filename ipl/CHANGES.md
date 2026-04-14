# Project Changes Summary - Session & Auth Refactor

This document outlines the architectural changes made to the Trinity IPL Pool application to fix session expiration issues and centralize authentication logic.

## 📁 New Files Created

| File Path | Description |
| :--- | :--- |
| `src/backend/session.py` | **Centralized Session Manager**: Handles JWT creation, decoding, validation, and auto-refresh logic. Manages HTTP-only cookie settings. |
| `src/api.js` | **Centralized API Client**: A wrapper around `fetch` that handles Bearer tokens, credentials (cookies), auto-refresh capture, and automatic 401 redirects. |

## 🛠️ Modified Files

### Backend (`src/backend/`)
- **`server.py`**:
    - Removed redundant JWT and cookie logic (delegated to `session.py`).
    - Added `@app.get("/verify")` for frontend session validation.
    - Added `@app.post("/logout")` to clear server-side cookies.
    - Simplified `get_current_user` dependency with auto-refresh support.
    - Cleaned up duplicate imports and unused code.

### Frontend (`src/pages/` & `src/components/`)
All pages were updated to use the new `apiFetch` utility instead of raw `fetch`. This ensures consistent session handling across the entire app.

- **`login.jsx`**: Updated to handle initial token storage and cookie initialization.
- **`dashboard.jsx`**: Added session verification on mount; fixed auto-refresh logic to prevent accidental logouts.
- **`matches.jsx`**: Updated all match fetching and betting logic to use the new API client.
- **`profile.jsx`**: Simplified user data fetching.
- **`leaderboard.jsx`**: Updated to use centralized API.
- **`resetpass.jsx`**: Updated both profile fetching and password reset submission.
- **`matchDetail.jsx`**: Updated nested API calls for match and pick data.
- **`Admin/admin.jsx`**: Updated admin dashboard fetching.
- **`Admin/addMatch.jsx`**: Updated match creation submission.
- **`Admin/adminUsers.jsx`**: Updated user management (fetch/add/remove).
- **`Admin/enterResults.jsx`**: Updated match result submission.
- **`components/sidebar.jsx`**: Updated logout button to call the new `/logout` API.
- **`components/admin_sidebar.jsx`**: Updated admin logout button.

## 🚀 Key Features Implemented

1.  **Silent Token Refresh**: When a user's token is within 2 hours of expiring, the backend automatically issues a new one. The frontend captures this and updates its local state without interrupting the user.
2.  **HTTP-Only Cookies**: Authentication is now backed by secure, HTTP-only cookies, which are more reliable than LocalStorage alone.
3.  **Automatic 401 Handling**: If a session finally expires, the application now redirects the user to the login page gracefully rather than just failing or showing errors.
4.  **Centralized Configuration**: All API communication now goes through a single channel (`api.js`), making future changes (like changing the API URL) much easier.
