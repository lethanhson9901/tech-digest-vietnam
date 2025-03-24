# app.py
import os
from datetime import datetime
from typing import List, Optional

import yaml
from bson.objectid import ObjectId
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

# Pydantic models
class Report(BaseModel):
    id: str
    filename: str
    content: str
    upload_date: datetime

class ReportList(BaseModel):
    reports: List[Report]
    count: int

# MongoDB connection
def get_mongo_client():
    """Get MongoDB client from config"""
    try:
        with open('config.yaml', 'r') as file:
            config = yaml.safe_load(file)
        
        uri = config['storage']['mongo_db_uri']
        return MongoClient(uri, server_api=ServerApi('1'))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to database: {str(e)}")

@app.on_event("startup")
async def startup_db_client():
    """Verify database connection on startup"""
    try:
        client = get_mongo_client()
        client.admin.command('ping')
        app.mongodb_client = client
        app.database = client.tech_digest
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    if hasattr(app, "mongodb_client"):
        app.mongodb_client.close()
        print("MongoDB connection closed")

# Routes
@app.get("/", response_class=JSONResponse)
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Tech Digest API", "status": "active"}

@app.get("/reports", response_model=ReportList)
async def get_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    """
    Get all reports with optional filtering
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
        total_count = app.database.reports.count_documents(query)
        
        # Get reports with pagination - convert cursor to list immediately
        cursor = app.database.reports.find(query).skip(skip).limit(limit).sort("upload_date", -1)
        reports_data = list(cursor)  # Convert cursor to list
        
        reports = []
        for doc in reports_data:
            reports.append(Report(
                id=str(doc["_id"]),
                filename=doc["filename"],
                content=doc["content"],
                upload_date=doc["upload_date"]
            ))
        
        return ReportList(reports=reports, count=total_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(e)}")

@app.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: str):
    try:
        report = app.database.reports.find_one({"_id": ObjectId(report_id)})
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

@app.get("/json-reports", response_model=ReportList)
async def get_json_reports(
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
        total_count = app.database.json_reports.count_documents(query)
        
        # Get reports with pagination - convert cursor to list immediately
        cursor = app.database.json_reports.find(query).skip(skip).limit(limit).sort("upload_date", -1)
        reports_data = list(cursor)  # Convert cursor to list
        
        reports = []
        for doc in reports_data:
            reports.append(Report(
                id=str(doc["_id"]),
                filename=doc["filename"],
                content=doc["content"],
                upload_date=doc["upload_date"]
            ))
        
        return ReportList(reports=reports, count=total_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch JSON reports: {str(e)}")

@app.get("/json-reports/{report_id}", response_model=Report)
async def get_json_report(report_id: str):
    """
    Get a specific JSON report by ID
    
    - **report_id**: MongoDB ObjectID as string
    """
    from bson.objectid import ObjectId
    
    try:
        # Remove the 'await' keyword here
        report = app.database.json_reports.find_one({"_id": ObjectId(report_id)})
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

# Run with: uvicorn app:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
