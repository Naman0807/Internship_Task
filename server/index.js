const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const cron = require('node-cron');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'naman',
    host: 'localhost',
    database: 'loan_db',
    password: '1412', // Add password if needed
    port: 5433,
});

// Test database connection
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
}

// Automation logic: Poll lender API every 30 seconds
async function syncLoanStatus() {
    const loanId = 'LN101';
    
    try {
        console.log('Starting loan status sync check...');
        
        // Step 1: Fetch status from Mock Lender API
        const lenderResponse = await axios.get(`http://localhost:8000/api/lender/loan-status/${loanId}`);
        const apiStatus = lenderResponse.data.status;
        
        // Step 2: Query current status from database
        const queryResult = await pool.query(
            'SELECT current_status FROM loans WHERE loan_id = $1',
            [loanId]
        );
        
        if (queryResult.rows.length === 0) {
            console.log(`Loan ${loanId} not found in database`);
            return;
        }
        
        const dbStatus = queryResult.rows[0].current_status;
        
        // Step 3: Compare statuses
        if (apiStatus !== dbStatus) {
            console.log(`Status changed! Updating from ${dbStatus} to ${apiStatus}`);
            
            // Step 4: Update loans table
            await pool.query(
                'UPDATE loans SET current_status = $1, updated_at = CURRENT_TIMESTAMP WHERE loan_id = $2',
                [apiStatus, loanId]
            );
            
            // Step 5: Insert into loan_status_history
            await pool.query(
                'INSERT INTO loan_status_history (loan_id, old_status, new_status, changed_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
                [loanId, dbStatus, apiStatus]
            );
            
            console.log(`Updated status from ${dbStatus} to ${apiStatus}`);
        } else {
            console.log('No change detected - skipping database updates');
        }
        
    } catch (error) {
        console.error('Error during loan status sync:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Mock Lender API is not running on port 8000');
        }
    }
}

// Schedule the job to run every 30 seconds
cron.schedule('*/30 * * * * *', syncLoanStatus);
console.log('Loan status sync job scheduled to run every 30 seconds');

// REST API endpoint for frontend
app.get('/api/loans', async (req, res) => {
    const loanId = 'LN101';
    
    try {
        // Get current loan details
        const loanQuery = await pool.query(`
            SELECT l.*, u.name as user_name 
            FROM loans l 
            JOIN users u ON l.user_id = u.user_id_str 
            WHERE l.loan_id = $1
        `, [loanId]);
        
        // Get loan status history
        const historyQuery = await pool.query(`
            SELECT id, old_status, new_status, changed_at 
            FROM loan_status_history 
            WHERE loan_id = $1 
            ORDER BY changed_at DESC
        `, [loanId]);
        
        if (loanQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Loan not found' });
        }
        
        const response = {
            loan: loanQuery.rows[0],
            history: historyQuery.rows
        };
        
        res.json(response);
        
    } catch (error) {
        console.error('Error fetching loan data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'loan-automation-backend' });
});

// Start server
async function startServer() {
    await testConnection();
    
    // Run initial sync
    await syncLoanStatus();
    
    app.listen(PORT, () => {
        console.log(`Main Backend server running on port ${PORT}`);
        console.log('Loan status automation system active');
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});

startServer().catch(console.error);