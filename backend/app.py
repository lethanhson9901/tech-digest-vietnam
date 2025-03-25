import base64
import os
import secrets
import subprocess
from datetime import datetime
from typing import List, Optional

import yaml
from bson.objectid import ObjectId
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Query,
    Request,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Initialize FastAPI
app = FastAPI(
    title="Tech Digest API",
    description="API for retrieving tech digest reports from MongoDB",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBasic()

# Credentials (in production, store these in environment variables)
CRON_USERNAME = os.getenv("CRON_USERNAME", "tson")
CRON_PASSWORD = os.getenv("CRON_PASSWORD", "Tsondeptrai99@")

# Pydantic models
class Report(BaseModel):
    id: str
    filename: str
    content: str
    upload_date: datetime

class ReportList(BaseModel):
    reports: List[Report]
    count: int

# New Pydantic models for summary view
class ReportSummary(BaseModel):
    id: str
    filename: str

class ReportSummaryList(BaseModel):
    reports: List[ReportSummary]
    count: int

# MongoDB connection dependency
def get_db():
    """Database connection dependency"""
    try:
        # Try to get connection string from environment first, then config file
        uri = os.getenv("MONGO_URI")
        if not uri:
            try:
                with open('config.yaml', 'r') as file:
                    config = yaml.safe_load(file)
                uri = config['storage']['mongo_db_uri']
            except Exception as e:
                print(f"Failed to load config: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Database configuration error: {str(e)}")
        
        # Connect to MongoDB
        client = MongoClient(uri, server_api=ServerApi('1'))
        db = client.tech_digest
        
        # Test connection
        client.admin.command('ping')
        
        try:
            yield db
        finally:
            client.close()
            
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Authentication function for basic auth
def verify_basic_auth(credentials: HTTPBasicCredentials = Depends(security)):
    is_username_correct = secrets.compare_digest(credentials.username, CRON_USERNAME)
    is_password_correct = secrets.compare_digest(credentials.password, CRON_PASSWORD)
    
    if not (is_username_correct and is_password_correct):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Authentication function for header auth (useful for Vercel cron which might not support Basic Auth)
def verify_header_auth(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Basic"},
        )
        
    try:
        # Check if it's Basic auth
        auth_type, auth_value = authorization.split(' ', 1)
        if auth_type.lower() == 'basic':
            credentials = base64.b64decode(auth_value).decode('utf-8')
            username, password = credentials.split(':', 1)
            
            is_username_correct = secrets.compare_digest(username, CRON_USERNAME)
            is_password_correct = secrets.compare_digest(password, CRON_PASSWORD)
            
            if is_username_correct and is_password_correct:
                return username
        
        # Also support a simple token approach for Vercel
        elif authorization == f"Bearer {CRON_USERNAME}:{CRON_PASSWORD}":
            return CRON_USERNAME
            
    except Exception:
        pass
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Basic"},
    )

# Routes
@app.get("/", response_class=JSONResponse)
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Tech Digest API", "status": "active"}

@app.get("/reports", response_model=ReportSummaryList)
async def get_reports(
    db = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    """
    Get all reports with optional filtering (summary format - ID and filename only)
    """
    query = {}
    
    # Add search filter if provided
    if search:
        query["$or"] = [
            {"filename": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    # Add date filters if provided
    date_filter = {}
    if date_from:
        try:
            from_date = datetime.strptime(date_from, "%Y-%m-%d")
            date_filter["$gte"] = from_date
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_from format. Use YYYY-MM-DD")
    
    if date_to:
        try:
            to_date = datetime.strptime(date_to, "%Y-%m-%d")
            date_filter["$lte"] = to_date
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_to format. Use YYYY-MM-DD")
    
    if date_filter:
        query["upload_date"] = date_filter
    
    try:
        # Get total count for pagination
        total_count = db.reports.count_documents(query)
        
        # Get reports with pagination - convert cursor to list immediately
        # Only retrieve _id and filename fields
        cursor = db.reports.find(query, {"_id": 1, "filename": 1}).skip(skip).limit(limit).sort("upload_date", -1)
        reports_data = list(cursor)
        
        reports = []
        for doc in reports_data:
            reports.append(ReportSummary(
                id=str(doc["_id"]),
                filename=doc["filename"]
            ))
        
        return ReportSummaryList(reports=reports, count=total_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(e)}")

@app.get("/reports/latest", response_model=Report)
async def get_latest_report(db = Depends(get_db)):
    """
    Get the most recently uploaded report with full content
    """
    try:
        # Find the most recent report by sorting on upload_date in descending order
        latest_report = db.reports.find_one(
            sort=[("upload_date", -1)]  # -1 means descending order
        )
        
        if latest_report:
            return Report(
                id=str(latest_report["_id"]),
                filename=latest_report["filename"],
                content=latest_report["content"],
                upload_date=latest_report["upload_date"]
            )
        else:
            raise HTTPException(status_code=404, detail="No reports found in the database")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch latest report: {str(e)}")

@app.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: str, db = Depends(get_db)):
    try:
        report = db.reports.find_one({"_id": ObjectId(report_id)})
        if report:
            return Report(
                id=str(report["_id"]),
                filename=report["filename"],
                content=report["content"],
                upload_date=report["upload_date"]
            )
        raise HTTPException(status_code=404, detail=f"Report with ID {report_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch report: {str(e)}")

@app.get("/json-reports", response_model=ReportSummaryList)
async def get_json_reports(
    db = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None
):
    """
    Get all JSON reports with optional filtering
    
    - **skip**: Number of reports to skip
    - **limit**: Maximum number of reports to return
    - **search**: Search term for filename or content
    """
    query = {}
    
    # Add search filter if provided
    if search:
        query["$or"] = [
            {"filename": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    try:
        # Get total count for pagination
        total_count = db.json_reports.count_documents(query)
        
        # Get reports with pagination - convert cursor to list immediately
        cursor = db.json_reports.find(query, {"_id": 1, "filename": 1}).skip(skip).limit(limit).sort("upload_date", -1)
        reports_data = list(cursor)
        
        reports = []
        for doc in reports_data:
            reports.append(ReportSummary(
                id=str(doc["_id"]),
                filename=doc["filename"]
            ))
        
        return ReportSummaryList(reports=reports, count=total_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch JSON reports: {str(e)}")

@app.get("/json-reports/latest", response_model=Report)
async def get_latest_json_report(db = Depends(get_db)):
    """
    Get the most recently uploaded JSON report with full content
    """
    try:
        # Find the most recent JSON report by sorting on upload_date in descending order
        latest_report = db.json_reports.find_one(
            sort=[("upload_date", -1)]  # -1 means descending order
        )
        
        if latest_report:
            return Report(
                id=str(latest_report["_id"]),
                filename=latest_report["filename"],
                content=latest_report["content"],
                upload_date=latest_report["upload_date"]
            )
        else:
            raise HTTPException(status_code=404, detail="No JSON reports found in the database")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch latest JSON report: {str(e)}")

@app.get("/json-reports/{report_id}", response_model=Report)
async def get_json_report(report_id: str, db = Depends(get_db)):
    """
    Get a specific JSON report by ID
    
    - **report_id**: MongoDB ObjectID as string
    """
    try:
        report = db.json_reports.find_one({"_id": ObjectId(report_id)})
        if report:
            return Report(
                id=str(report["_id"]),
                filename=report["filename"],
                content=report["content"],
                upload_date=report["upload_date"]
            )
        raise HTTPException(status_code=404, detail=f"JSON report with ID {report_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch JSON report: {str(e)}")

# Cron job endpoint for scheduled tasks
@app.post("/api/cron")
async def run_workflow(
    request: Request, 
    background_tasks: BackgroundTasks,
    db = Depends(get_db),
    username: str = Depends(verify_header_auth)
):
    """
    Endpoint for scheduled workflow execution.
    This will be triggered by Vercel's cron job.
    
    Requires authentication with username
    """
    # Start the workflow in the background
    background_tasks.add_task(execute_workflow, db)
    
    # Log the cron job execution to MongoDB for tracking
    try:
        db.cron_logs.insert_one({
            "execution_time": datetime.utcnow(),
            "status": "started",
            "ip": request.client.host,
            "authenticated_as": username
        })
    except Exception as e:
        print(f"Failed to log cron execution: {str(e)}")
    
    return {"status": "success", "message": "Workflow started in background"}

def execute_workflow(db):
    """Execute the workflow.py script as a subprocess"""
    log_id = None
    
    # Create a log entry
    try:
        result = db.cron_logs.insert_one({
            "execution_time": datetime.utcnow(),
            "status": "running",
            "start_time": datetime.utcnow()
        })
        log_id = result.inserted_id
    except Exception as e:
        print(f"Failed to create log entry: {str(e)}")
    
    try:
        # Execute the workflow script
        process = subprocess.run(
            ["python", "workflow.py"],
            capture_output=True,
            text=True,
            check=False  # Don't raise exception on non-zero exit
        )
        
        # Determine success based on exit code
        success = process.returncode == 0
        status = "completed" if success else "failed"
        
        # Update the log with results
        if log_id:
            db.cron_logs.update_one(
                {"_id": log_id},
                {"$set": {
                    "status": status,
                    "end_time": datetime.utcnow(),
                    "exit_code": process.returncode,
                    "stdout": process.stdout[-10000:] if process.stdout else "",  # Limit output size
                    "stderr": process.stderr[-10000:] if process.stderr else ""   # Limit output size
                }}
            )
        
        # Log results
        if success:
            print(f"Workflow executed successfully")
        else:
            print(f"Workflow execution failed with exit code {process.returncode}")
            print(f"Error: {process.stderr}")
        
        return success
        
    except Exception as e:
        # Update log with error
        if log_id:
            db.cron_logs.update_one(
                {"_id": log_id},
                {"$set": {
                    "status": "error",
                    "end_time": datetime.utcnow(),
                    "error": str(e)
                }}
            )
        print(f"Error executing workflow: {str(e)}")
        return False

# Add an endpoint to view cron logs (protected by the same authentication)
@app.get("/api/cron-logs")
async def get_cron_logs(
    db = Depends(get_db),
    limit: int = 10,
    username: str = Depends(verify_basic_auth)
):
    """
    View recent cron job execution logs
    Requires authentication
    """
    try:
        logs = list(db.cron_logs.find().sort("execution_time", -1).limit(limit))
        return {
            "logs": [
                {
                    **{k: v for k, v in log.items() if k != "_id"}, 
                    "id": str(log["_id"]),
                    "execution_time": log["execution_time"].isoformat() if "execution_time" in log else None,
                    "start_time": log["start_time"].isoformat() if "start_time" in log else None,
                    "end_time": log["end_time"].isoformat() if "end_time" in log else None
                } 
                for log in logs
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch cron logs: {str(e)}")

# Run with: uvicorn app:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
