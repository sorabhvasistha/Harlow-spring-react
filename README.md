# Harlow

A React and Spring Boot account application with SQLite-backed users and secure server sessions.

## Structure

```text
Harlow-spring-react/
├── backend/
│   ├── src/main/java/io/git/sorabh86/harlowBack/
│   │   ├── config/        # Security and CORS configuration

Check the backend in a browser at [http://localhost:8080/api/health](http://localhost:8080/api/health). A working server returns JSON with `"status": "ok"`.
│   │   ├── controllers/   # Auth endpoints
│   │   ├── models/        # API models
│   │   ├── repository/    # SQLite data access
│   │   ├── security/      # Session security contract
│   │   └── services/      # Auth business logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/    # AuthPanel and ProtectedRoute
│   │   ├── context/       # AuthContext session state
│   │   ├── services/      # API client
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md
```

## Run

### Double-click launcher

From the project root, double-click the launcher for your operating system:

- Linux: `run-harlow.sh` (make it executable once with `chmod +x run-harlow.sh`)
- macOS: `run-harlow.command`
- Windows: `run-harlow.bat`

Each launcher opens separate terminal windows for the backend and frontend. Then open `http://localhost:5173`.

Start the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The backend creates `backend/harlow.db` on first start. Passwords are BCrypt-hashed and sessions use an HttpOnly, SameSite cookie with a 30-minute timeout.

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Visitors can create an account, log in, restore an existing session, and log out.

## Checks

```bash
cd backend && ./mvnw test
cd frontend && npm run build && npm run lint
```
