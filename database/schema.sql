-- Database Schema for Real-Time Loan Status Automation System
-- PostgreSQL Database: loan_db on localhost:5433
-- User: naman

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS loan_status_history CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id_str VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create loans table
CREATE TABLE loans (
    loan_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    current_status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id_str) ON DELETE CASCADE
);

-- Create loan_status_history table for audit trail
CREATE TABLE loan_status_history (
    id SERIAL PRIMARY KEY,
    loan_id VARCHAR(50) NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_current_status ON loans(current_status);
CREATE INDEX idx_loan_history_loan_id ON loan_status_history(loan_id);
CREATE INDEX idx_loan_history_changed_at ON loan_status_history(changed_at);

-- Seed Data: Insert exactly one user and one loan as specified
INSERT INTO users (user_id_str, name) VALUES ('U12', 'Naman Patel');

INSERT INTO loans (loan_id, user_id, amount, current_status) VALUES 
('LN101', 'U12', 50000.00, 'Applied');