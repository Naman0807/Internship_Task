from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn
import random

app = FastAPI(
    title="Mock Lender Service",
    description="Simulates a bank changing loan statuses"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOAN_STATUSES = ["Applied", "Approved", "Disbursed", "Rejected"]
# Track status index for each loan separately
loan_status_cycles = {
    "LN101": 0,
    "LN102": 1,  # Start at different positions for variety
    "LN103": 2
}

# Map loan IDs to user IDs
loan_user_mapping = {
    "LN101": "U12",
    "LN102": "U23", 
    "LN103": "U34"
}

@app.get("/api/lender/loan-status/{loan_id}")
async def get_loan_status(loan_id: str):
    # Initialize loan status cycle if not exists
    if loan_id not in loan_status_cycles:
        loan_status_cycles[loan_id] = 0
    
    # Get current status for this specific loan
    current_index = loan_status_cycles[loan_id]
    status = LOAN_STATUSES[current_index]
    
    # Move to next status for next call
    loan_status_cycles[loan_id] = (current_index + 1) % len(LOAN_STATUSES)

    # Generate approved amount based on loan amount if approved
    if status == "Approved":
        loan_amounts = {"LN101": 50000, "LN102": 75000, "LN103": 35000}
        max_approved = loan_amounts.get(loan_id, 50000) - 5000  # Ensure less than loan amount
        min_approved = 10000
        approved_amount = random.randint(min_approved, max_approved)
    else:
        approved_amount = None

    return {
        "loan_id": loan_id,
        "user_id": loan_user_mapping.get(loan_id, "U12"),
        "status": status,
        "approved_amount": approved_amount,
        "updated_at": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mock-lender"}

if __name__ == "__main__":
    print("Starting Mock Lender Service on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
