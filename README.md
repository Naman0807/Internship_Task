# Real-Time Loan Status Automation System

> A full-stack application for automating and tracking loan status updates in real-time.

## 📋 Overview

This system provides end-to-end loan status management with real-time updates. It consists of:

- **Frontend**: React + Vite dashboard for visualization
- **Backend**: Node.js/Express API for processing and data management
- **Mock Lender**: Python service simulating lender API responses
- **Database**: PostgreSQL for persistent storage

## 🔧 Prerequisites

Ensure the following software is installed:

- **Node.js** v16+ ([download](https://nodejs.org))
- **npm** (comes with Node.js)
- **Python** v3.8+ ([download](https://www.python.org))
- **PostgreSQL** v12+ running on port 5433

## 🚀 Quick Start

### 1️⃣ Database Setup

```bash
# Connect to PostgreSQL
psql -h localhost -p 5433 -U naman

# Create the application database
CREATE DATABASE loan_db;
\c loan_db;

# Exit psql
\q

# Execute the schema script
psql -h localhost -p 5433 -U naman -d loan_db -f database/schema.sql
```

### 2️⃣ Mock Lender Service (Port 8000)

```bash
cd mock_lender
pip install -r requirements.txt
python main.py
```

The service simulates lender API responses and runs on `http://localhost:8000`.

### 3️⃣ Backend API (Port 3000)

Open a new terminal:

```bash
cd server
npm install
npm start
```

The backend polls the mock lender API every 30 seconds and updates the database.

### 4️⃣ Frontend Dashboard (Port 5173)

Open another terminal:

```bash
npm install
npm run dev
```

The dashboard refreshes every 5 seconds and is available at `http://localhost:5173`.

## 🌐 Access Points

| Service            | URL                                                  |
| ------------------ | ---------------------------------------------------- |
| Frontend Dashboard | `http://localhost:5173`                              |
| Backend API        | `http://localhost:3000/api/loans`                    |
| Mock Lender API    | `http://localhost:8000/api/lender/loan-status/LN101` |

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend (5173)                  │
│         Displays loan status dashboard                  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js Backend (3000)                     │
│   Polls lender API, updates database every 30 secs      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌───────────────────┐    ┌──────────────────┐
│  PostgreSQL (5433)│    │Mock Lender (8000)│
│    Database       │    │  FastAPI Service │
└───────────────────┘    └──────────────────┘
```

## 📁 Project Structure

```
.
├── database/
│   └── schema.sql              # Database schema and seed data
├── mock_lender/
│   ├── main.py                 # FastAPI mock lender service
│   └── requirements.txt         # Python dependencies
├── server/
│   ├── index.js                # Node.js backend entry point
│   └── package.json            # Backend dependencies
├── App.jsx                      # React main component
├── app.css                      # Styles
├── main.jsx                     # React entry point
├── index.html                   # HTML template
├── package.json                 # Frontend dependencies
├── vite.config.js              # Vite configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔄 System Workflow

1. **Mock Lender Service** → Returns randomized loan status responses
2. **Backend Service** → Polls the lender API every 30 seconds, detects changes, and updates the database
3. **Frontend Application** → Refreshes every 5 seconds and displays the latest loan status data

## 📝 Monitoring

Check the backend terminal for updates every 30 seconds:

- `"No change"` - Loan status remains the same
- `"Updated status from <OLD> to <NEW>"` - Status has changed

The frontend dashboard will reflect any updates within 5 seconds.

## ⚠️ Troubleshooting

| Issue                      | Solution                                                                   |
| -------------------------- | -------------------------------------------------------------------------- |
| Database connection errors | Ensure PostgreSQL is running on port 5433                                  |
| Port conflicts             | Check that ports 8000, 3000, and 5173 are available                        |
| Module not found errors    | Run `npm install` (frontend) or `pip install -r requirements.txt` (Python) |
| No data displaying         | Verify all three services are running                                      |

## 📦 Available Scripts

**Frontend:**

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Backend:**

```bash
npm start        # Start the server
npm run dev      # Start with nodemon (auto-reload)
```

**Mock Lender:**

```bash
python main.py   # Run the mock lender service
```

## 🔐 Environment Variables

Create a `.env` file in the project root if needed:

```
DATABASE_URL=postgresql://user:password@localhost:5433/loan_db
LENDER_API_URL=http://localhost:8000
POLLING_INTERVAL=30000
```

## 📄 License

MIT

## 👤 Author

Naman Parmar

---

**Last Updated:** January 16, 2026
