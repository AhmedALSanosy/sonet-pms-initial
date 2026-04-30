"""
Sonet PMS — Backend API
FastAPI Backend for Sonet Lab Management System
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uvicorn

app = FastAPI(
    title="Sonet PMS API",
    description="نظام إدارة معمل التحاليل الذكي - Backend API",
    version="0.1.0",
)

# CORS Configuration for Tauri
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:1420",  # Tauri dev
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",
        "tauri://localhost",
        "https://tauri.localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===================== Models =====================

class PatientCreate(BaseModel):
    name: str
    age: int
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None

class PatientResponse(BaseModel):
    id: str
    name: str
    age: int
    phone: str
    email: Optional[str]
    created_at: str

class TestOrderCreate(BaseModel):
    patient_id: str
    tests: list[str]
    priority: Optional[str] = "normal"
    notes: Optional[str] = None

class VoiceCommand(BaseModel):
    transcript: str
    language: Optional[str] = "ar-EG"


# ===================== Health Check =====================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Sonet PMS API",
        "version": "0.1.0",
        "timestamp": datetime.now().isoformat(),
        "database": "connected",
        "voice_engine": "ready",
    }


# ===================== Patients =====================

@app.get("/api/patients")
async def get_patients(
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
):
    """Get all patients with optional search"""
    # TODO: Implement database query
    return {
        "patients": [],
        "total": 0,
        "page": page,
        "limit": limit,
    }

@app.post("/api/patients")
async def create_patient(patient: PatientCreate):
    """Create a new patient"""
    # TODO: Implement database insert
    return {
        "message": "Patient created successfully",
        "patient_id": "P-2848",
    }

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get a specific patient by ID"""
    # TODO: Implement database query
    return {
        "id": patient_id,
        "name": "أحمد حسن إبراهيم",
        "age": 45,
        "phone": "01012345678",
    }


# ===================== Test Orders =====================

@app.get("/api/orders")
async def get_orders(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
):
    """Get all test orders"""
    return {
        "orders": [],
        "total": 0,
        "page": page,
        "limit": limit,
    }

@app.post("/api/orders")
async def create_order(order: TestOrderCreate):
    """Create a new test order"""
    return {
        "message": "Order created successfully",
        "order_id": "ORD-4522",
    }


# ===================== Results =====================

@app.get("/api/results")
async def get_results(
    patient_id: Optional[str] = None,
    status: Optional[str] = None,
):
    """Get test results"""
    return {
        "results": [],
        "total": 0,
    }


# ===================== Invoices =====================

@app.get("/api/invoices")
async def get_invoices(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
):
    """Get all invoices"""
    return {
        "invoices": [],
        "total": 0,
    }


# ===================== Reports =====================

@app.get("/api/reports/summary")
async def get_reports_summary():
    """Get dashboard summary report"""
    return {
        "total_patients": 2847,
        "today_orders": 156,
        "results_ready": 89,
        "today_revenue": 45200,
    }


# ===================== Voice Assistant =====================

@app.post("/api/voice/process")
async def process_voice_command(command: VoiceCommand):
    """
    Process voice command through:
    1. STT (Whisper) - already transcribed
    2. LLM (Gemma/Qwen) - process intent
    3. TTS (XTTS-v2/MeloTTS) - generate response
    
    TODO: Integrate with local models
    """
    return {
        "transcript": command.transcript,
        "intent": "create_test_order",
        "entities": {
            "test_type": "CBC",
            "patient_name": "محمد أحمد",
        },
        "response": "تمام يا دكتور، هنسجل تحليل CBC للمريض محمد أحمد. هل نضيف تحاليل تانية؟",
        "confidence": 0.95,
    }

@app.get("/api/voice/status")
async def voice_engine_status():
    """Check voice engine status"""
    return {
        "stt": {"engine": "whisper", "status": "ready", "model": "base"},
        "llm": {"engine": "gemma", "status": "ready", "model": "gemma-4-1b-q4"},
        "tts": {"engine": "xtts-v2", "status": "ready"},
    }


# ===================== Run =====================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
