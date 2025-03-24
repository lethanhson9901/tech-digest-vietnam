import os
import sys

# Add the parent directory to path so we can import app.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# This is needed for Vercel
app = app
