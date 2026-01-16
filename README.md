# Real-Time Loan Status Automation System

> A multi-user, full-stack application for automating and tracking loan status updates in real-time.

## 📋 Overview

This system provides end-to-end loan status management with real-time updates across multiple users. It consists of:

- **Frontend**: React + Vite dashboard with multi-user support and navigation
- **Backend**: Node.js/Express API for processing and data management
- **Mock Lender**: Python FastAPI service simulating multiple lender responses
- **Database**: PostgreSQL for persistent storage with multi-user support

### 🆕 New Features
- **Multi-User Dashboard**: View all 3 users' loan status on main dashboard
- **Individual Loan Pages**: Click any user card to view detailed loan history
- **Independent Status Cycles**: Each loan progresses through statuses separately
- **Smart Approved Amounts**: Random amounts calculated per loan size

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
cd client
npm install
npm run dev
```

The dashboard refreshes every 5 seconds and is available at `http://localhost:5173`.

## 👥 Users & Loans

| User ID | Name          | Loan ID | Loan Amount |
|---------|---------------|---------|-------------|
| U12     | Naman Patel   | LN101   | $50,000     |
| U23     | Priya Sharma  | LN102   | $75,000     |
| U34     | Rahul Kumar   | LN103   | $35,000     |

## 🌐 Access Points

| Service              | URL                                                  | Description                              |
| -------------------- | ---------------------------------------------------- | ---------------------------------------- |
| Frontend Dashboard    | `http://localhost:5173`                              | Main dashboard with all users             |
| Individual Loan Page  | `http://localhost:5173/loan/LN101`                   | Detailed view for LN101 (change ID)       |
| Backend API (All)     | `http://localhost:3000/api/loans`                    | List all loans                           |
| Backend API (Single)  | `http://localhost:3000/api/loans/LN101`              | Get specific loan details               |
| Mock Lender API      | `http://localhost:8000/api/lender/loan-status/LN101`  | Mock lender response (change ID)          |

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              React Frontend (5173)                      │
│     Multi-user dashboard with navigation                │
│       ├── Main page: All users grid                     │
│       └── Detail page: Individual loan history          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js Backend (3000)                     │
│  Syncs 3 loans every 30 secs with separate cycles       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌───────────────────┐    ┌──────────────────┐
│  PostgreSQL (5433)│    │Mock Lender (8000)│
│ Multi-user DB     │    │  FastAPI Service │
│ 3 users + 3 loans │    │ Individual loan  │
└───────────────────┘    └──────────────────┘
```

## 📁 Project Structure

```
.
├── client/
│   ├── app.jsx                 # React router setup
│   ├── Dashboard.jsx           # Main multi-user dashboard
│   ├── LoanDetail.jsx          # Individual loan detail page
│   ├── App.css                 # Styles
│   ├── main.jsx                # React entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── database/
│   ├── schema.sql              # Database schema with 3 users/loans
│   └── migration_add_approved_amount.sql # Migration script
├── mock_lender/
│   ├── main.py                 # FastAPI mock lender service
│   └── requirements.txt         # Python dependencies
├── server/
│   ├── index.js                # Node.js backend with multi-loan sync
│   └── package.json            # Backend dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔄 System Workflow

1. **Mock Lender Service** → Returns randomized loan status responses for each loan independently
2. **Backend Service** → Polls all 3 loans every 30 seconds, detects changes, and updates database
3. **Frontend Application** → 
   - Main dashboard: Shows all 3 users' loan status in a grid
   - Detail pages: Individual loan history with status filters
   - Auto-refreshes every 5 seconds on all pages

## 📝 Monitoring

Check the backend terminal for updates every 30 seconds:

- `"No change detected"` - Loan statuses remain the same
- `"Updated status from <OLD> to <NEW>"` - Individual loan status has changed
- `"Error syncing loan <ID>"` - Issue with specific loan sync

The frontend dashboard will reflect any updates within 5 seconds. Each loan progresses independently through the cycle: Applied → Approved → Disbursed → Rejected → Applied.

## 🔄 Status Cycle & Approved Amounts

### Status Progression
Each loan follows this status progression independently:
- **Applied** → **Approved** → **Disbursed** → **Rejected** → **Applied** (cycle repeats)

### Approved Amount Logic
When status changes to **Approved**, a random approved amount is generated that's less than the original loan amount:

- **LN101** ($50,000): $10,000 - $45,000 approved
- **LN102** ($75,000): $10,000 - $70,000 approved  
- **LN103** ($35,000): $10,000 - $30,000 approved

Each loan starts at different positions in the cycle for dashboard variety.

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
cd client
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
