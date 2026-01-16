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
current_status_index = 0

@app.get("/api/lender/loan-status/{loan_id}")
async def get_loan_status(loan_id: str):
    global current_status_index
    
    status = LOAN_STATUSES[current_status_index]
    
    current_status_index = (current_status_index + 1) % len(LOAN_STATUSES)


    approved_amount = random.randint(10000, 45000) if status == "Approved" else None

    return {
        "loan_id": loan_id,
        "user_id": "U12",
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
