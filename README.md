# Real-Time Loan Status Automation System - Startup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16+) installed
- **npm** installed 
- **Python** (v3.8+) installed
- **PostgreSQL** installed and running on port 5433

## 🗄️ Step 1: Setup Database

1. Connect to PostgreSQL:
   ```bash
   psql -h localhost -p 5433 -U naman
   ```

2. Create database:
   ```sql
   CREATE DATABASE loan_db;
   \c loan_db;
   ```

3. Run the schema:
   ```bash
   psql -h localhost -p 5433 -U naman -d loan_db -f database/schema.sql
   ```

## 🐍 Step 2: Start Mock Lender Service (Port 8000)

1. Navigate to mock lender directory:
   ```bash
   cd mock_lender
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the service:
   ```bash
   python main.py
   ```

## 🟢 Step 3: Start Main Backend (Port 3000)

1. Open a new terminal, navigate to server directory:
   ```bash
   cd server
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the backend service:
   ```bash
   npm start
   ```

## 🎨 Step 4: Start Frontend (Port 5173)

1. Open another terminal, navigate to project root:
   ```bash
   cd ..  # Back to project root
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🚀 Step 5: Access the Dashboard

Open your browser and go to: **http://localhost:5173**

## ✅ Verification

To verify all services are running:

- **Mock Lender API**: http://localhost:8000/api/lender/loan-status/LN101
- **Backend API**: http://localhost:3000/api/loans  
- **Frontend Dashboard**: http://localhost:5173

## 🔄 How It Works

1. **Mock Lender** (Port 8000): Returns random loan statuses
2. **Backend** (Port 3000): Polls every 30 seconds, detects changes, updates database
3. **Frontend** (Port 5173): Auto-refreshes every 5 seconds to display latest data

## 📊 Test the System

Watch the console logs in the backend terminal. Every 30 seconds you'll see:
- "No change" (if status same) or 
- "Updated status from X to Y" (when random change occurs)

The frontend dashboard will automatically update within 5 seconds to reflect any changes.

## 🛠️ Troubleshooting

- **Database connection**: Ensure PostgreSQL is running on port 5433
- **Port conflicts**: Make sure ports 8000, 3000, and 5173 are available
- **Dependencies**: Run `npm install` and `pip install` if you get import errors

## 📁 Project Structure

```
├── database/
│   └── schema.sql              # Database schema and seed data
├── mock_lender/
│   ├── main.py                # FastAPI mock lender service
│   └── requirements.txt       # Python dependencies
├── server/
│   ├── index.js               # Node.js backend service
│   └── package.json           # Node.js dependencies
├── App.jsx                    # React frontend component
├── index.html                 # HTML with Tailwind CDN
├── main.jsx                   # React entry point
├── package.json               # Frontend dependencies
└── vite.config.js            # Vite configuration
```