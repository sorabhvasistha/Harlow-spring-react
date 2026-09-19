# Harlow

Harlow is a React and Spring Boot account application. Visitors can create an account, log in, maintain a secure server session, and access a protected dashboard.

## Features

- SQLite-backed user accounts
- BCrypt password hashing
- HttpOnly, SameSite session cookies
- Session restoration when the frontend reloads
- Login, registration, and logout
- Protected React `/dashboard` route
- Public backend health check at `/api/health`
- Responsive Harlow landing page and account dashboard
- Vite development proxy from `/api` to Spring Boot

## Project Structure

```text
Harlow-spring-react/
├── backend/
│   ├── src/main/java/io/git/sorabh86/harlowBack/
│   │   ├── config/        # Security and CORS configuration
│   │   ├── controllers/   # Auth and health endpoints
│   │   ├── models/        # API response models
│   │   ├── repository/    # SQLite data access
│   │   ├── security/      # Session security contract
│   │   └── services/      # Authentication business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/    # AuthPanel, Dashboard, ProtectedRoute
│   │   ├── context/       # Global AuthContext state
│   │   ├── services/      # Fetch API client
│   │   ├── App.jsx        # Routes and landing page
│   │   └── index.js       # React entry point
│   └── package.json
├── run-harlow.sh          # Linux launcher
├── run-harlow.command     # macOS launcher
├── run-harlow.bat         # Windows launcher
└── README.md
```

## Prerequisites

- Java Development Kit 17 or newer
- Node.js 18 or newer
- npm

PostgreSQL is not required. The application uses SQLite and creates `backend/harlow.db` automatically on first backend startup.

## Run Manually

Open two terminals from the project root.

### 1. Start the backend

Linux/macOS:

```bash
cd backend
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite proxy forwards frontend `/api` requests to the backend at port `8080`.

## Double-Click Launchers

From the project root, use the launcher for your operating system:

- Linux: double-click `run-harlow.sh`. If needed, run `chmod +x run-harlow.sh` once.
- macOS: double-click `run-harlow.command`. If macOS blocks it, right-click and choose **Open**.
- Windows: double-click `run-harlow.bat`.

Each launcher opens separate terminal windows for the backend and frontend. Stop each process with `Ctrl+C` in its terminal window.

## Verify the Backend

Open the health endpoint in a browser:

[http://localhost:8080/api/health](http://localhost:8080/api/health)

A healthy backend returns JSON similar to:

```json
{
  "status": "ok",
  "service": "harlow-backend",
  "timestamp": "2026-09-19T15:26:38.594505754Z"
}
```

## Authentication Flow

1. Select **Create account** or **Log in** on the landing page.
2. Submit the form. Passwords are hashed before they are stored in SQLite.
3. On success, the frontend navigates to `/dashboard`.
4. The server session is restored after a page refresh through `GET /api/auth/me`.
5. Selecting **Log out** invalidates the server session and returns the user to `/`.
6. Opening `/dashboard` without an active session redirects to `/`.

## Useful Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check whether the backend is running |
| `POST` | `/api/auth/register` | Create an account and start a session |
| `POST` | `/api/auth/login` | Authenticate and start a session |
| `GET` | `/api/auth/me` | Restore the current session |
| `POST` | `/api/auth/logout` | Invalidate the current session |

## Validation Commands

Backend tests:

```bash
cd backend
./mvnw clean test
```

Frontend build and lint:

```bash
cd frontend
npm run build
npm run lint
```

## Local Files Not Committed

The root `.gitignore` excludes generated and machine-specific files, including:

- SQLite databases such as `backend/harlow.db`
- Maven `target/`
- `frontend/node_modules/`
- Vite `frontend/dist/`
- IDE settings and operating-system files
- Logs and generated archives
