import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from . import models, schemas

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Khet2Cart API",
    description="Direct Farm-to-Consumer Agricultural Commerce Platform",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "Khet2Cart",
        "tagline": "Khet se seedha cart tak",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "platform": "Khet2Cart"}

# FastAPI application structure is ready for uvicorn
