from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime
import uvicorn

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

@app.get("/api/lender/loan-status/{loan_id}")
async def get_loan_status(loan_id: str):
    status = random.choice(LOAN_STATUSES)

    return {
        "loan_id": loan_id,
        "status": status,
        "updated_at": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mock-lender"}

if __name__ == "__main__":
    print("Starting Mock Lender Service on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
