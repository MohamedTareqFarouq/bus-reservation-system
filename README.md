# Payment Gateway

## Development Setup

### Backend (Port 5000)
```bash
npm run server
# or
npm run dev
```

### Frontend (Port 3000)
```bash
npm run client
# or
$env:PORT = "3000"; npm start
```

### Run Both Simultaneously
```bash
npm run dev:full
```

## Port Configuration
- Backend runs on port 5000 (configured in .env)
- Frontend runs on port 3000 (configured in package.json client script)
- CORS is configured to allow frontend origin (http://localhost:3000)

## Nodemon Configuration
- Watches server.js, routes/, middleware/, and helperFunctions/
- Ignores node_modules/, src/, and public/ directories
- Automatically restarts server on file changes

