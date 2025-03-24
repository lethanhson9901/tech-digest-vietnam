# /api/cron.py
from app import app
from fastapi import BackgroundTasks, Header, Request
from mangum import Mangum

# Create a handler for AWS Lambda
handler = Mangum(app)

# Define a function to handle the request
async def handle(request: Request, background_tasks: BackgroundTasks, authorization: str = Header(None)):
    # Find the cron endpoint in the app routes
    for route in app.routes:
        if route.path == "/api/cron" and "POST" in route.methods:
            # Pass the authorization header to the endpoint
            return await route.endpoint(request, background_tasks, authorization)
    
    return {"status": "error", "message": "Cron endpoint not found"}
