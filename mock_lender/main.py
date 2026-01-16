from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime
import uvicorn

app = FastAPI(title="Mock Lender Service", description="Simulates a bank changing loan statuses")

# Enable CORS to allow frontend and backend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# List of possible loan statuses
LOAN_STATUSES = ["Applied", "Approved", "Disbursed", "Rejected"]

@app.get("/api/lender/loan-status/{loan_id}")
async def get_loan_status(loan_id: str):
    """
    Returns mock loan status data with randomly selected status
    to simulate real-time updates from a lender service.
    """
    # Randomly select a status to simulate changing loan states
    status = random.choice(LOAN_STATUSES)
    
    # Generate response with current timestamp
    response = {
        "loan_id": loan_id,
        "status": status,
        "updated_at": datetime.now().isoformat()
    }
    
    return response

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "mock-lender"}

if __name__ == "__main__":
    print("Starting Mock Lender Service on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)