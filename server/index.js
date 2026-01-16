const express = require("express");
const { Pool } = require("pg");
const axios = require("axios");
const cron = require("node-cron");
const cors = require("cors");

const APP_NAME = "loan-automation-backend";
const PORT = 3000;

const LENDER_API_BASE_URL = "http://localhost:8000";
const LOAN_STATUS_ENDPOINT = `${LENDER_API_BASE_URL}/api/lender/loan-status`;
const CRON_SCHEDULE = "*/30 * * * * *";

// List of all loan IDs to track
const LOAN_IDS = ["LN101", "LN102", "LN103"];

const DB_CONFIG = {
	user: "naman",
	host: "localhost",
	database: "loan_db",
	password: "1412",
	port: 5433,
};

const app = express();
const pool = new Pool(DB_CONFIG);

app.use(cors());
app.use(express.json());

async function testConnection() {
	try {
		const client = await pool.connect();
		console.log("Successfully connected to PostgreSQL database");
		client.release();
	} catch (err) {
		console.error("Database connection error:", err.message);
		process.exit(1);
	}
}

async function syncLoanStatus() {
	try {
		console.log("Starting loan status sync check for all loans...");

		for (const loanId of LOAN_IDS) {
			try {
				const lenderResponse = await axios.get(`${LOAN_STATUS_ENDPOINT}/${loanId}`);
				const apiStatus = lenderResponse.data.status;
				const approvedAmount = lenderResponse.data.approved_amount;

				const queryResult = await pool.query(
					"SELECT current_status FROM loans WHERE loan_id = $1",
					[loanId]
				);

				if (queryResult.rows.length === 0) {
					console.log(`Loan ${loanId} not found in database`);
					continue;
				}

				const dbStatus = queryResult.rows[0].current_status;

				if (apiStatus !== dbStatus) {
					console.log(`Status changed for ${loanId}! Updating from ${dbStatus} to ${apiStatus}`);

					await pool.query(
						"UPDATE loans SET current_status = $1, approved_amount = $2, updated_at = CURRENT_TIMESTAMP WHERE loan_id = $3",
						[apiStatus, approvedAmount, loanId]
					);

					await pool.query(
						"INSERT INTO loan_status_history (loan_id, old_status, new_status, changed_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
						[loanId, dbStatus, apiStatus]
					);

					console.log(`Updated ${loanId} status from ${dbStatus} to ${apiStatus}, approved_amount: ${approvedAmount}`);
				}
			} catch (loanError) {
				console.error(`Error syncing loan ${loanId}:`, loanError.message);
			}
		}
	} catch (error) {
		console.error("Error during loan status sync:", error.message);
		if (error.code === "ECONNREFUSED") {
			console.error("Mock Lender API is not running on port 8000");
		}
	}
}

cron.schedule(CRON_SCHEDULE, syncLoanStatus);
console.log("Loan status sync job scheduled");

// Get all loans/users for main dashboard
app.get("/api/loans", async (req, res) => {
	try {
		const loansQuery = await pool.query(
			`SELECT l.*, u.name AS user_name
             FROM loans l
             JOIN users u ON l.user_id = u.user_id_str
             ORDER BY l.loan_id`
		);

		res.json({
			loans: loansQuery.rows,
		});
	} catch (error) {
		console.error("Error fetching all loans:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get specific loan details with history
app.get("/api/loans/:loanId", async (req, res) => {
	const { loanId } = req.params;
	
	try {
		const loanQuery = await pool.query(
			`SELECT l.*, u.name AS user_name
             FROM loans l
             JOIN users u ON l.user_id = u.user_id_str
             WHERE l.loan_id = $1`,
			[loanId]
		);

		if (loanQuery.rows.length === 0) {
			return res.status(404).json({ error: "Loan not found" });
		}

		const historyQuery = await pool.query(
			`SELECT id, old_status, new_status, changed_at
             FROM loan_status_history
             WHERE loan_id = $1
             ORDER BY changed_at DESC`,
			[loanId]
		);

		res.json({
			loan: loanQuery.rows[0],
			history: historyQuery.rows,
		});
	} catch (error) {
		console.error("Error fetching loan data:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/health", (req, res) => {
	res.json({ status: "healthy", service: APP_NAME });
});

async function startServer() {
	await testConnection();
	await syncLoanStatus();

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

process.on("SIGINT", async () => {
	console.log("Shutting down gracefully...");
	await pool.end();
	process.exit(0);
});

startServer().catch(console.error);
