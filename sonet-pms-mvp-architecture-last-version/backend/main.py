# ============================================================
# Sonet PMS — FastAPI Backend (SQLite + SQLAlchemy + Auth)
# ============================================================

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text, Enum as SAEnum
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import uvicorn

# ─── Database Setup ───
DATABASE_URL = "sqlite:///./sonet_pms.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


# ─── SQLAlchemy Models ───
class PatientDB(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    name_ar = Column(String)
    age = Column(Integer)
    gender = Column(String)
    phone = Column(String)
    national_id = Column(String, unique=True)
    status = Column(String, default="active")
    last_visit = Column(String)
    total_orders = Column(Integer, default=0)
    balance = Column(Float, default=0.0)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    patient_id = Column(String, index=True)
    patient_name = Column(String)
    tests = Column(Text)  # JSON string
    status = Column(String, default="pending")
    priority = Column(String, default="normal")
    notes = Column(Text, nullable=True)
    total_amount = Column(Float, default=0.0)
    created_at = Column(String)
    due_at = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# Seed data if empty
def seed_db():
    db = SessionLocal()
    if db.query(PatientDB).count() == 0:
        patients = [
            PatientDB(code="P-1001", name="Ahmed Mohamed Ali", name_ar="أحمد محمد علي", age=45, gender="male", phone="010-1234-5678", national_id="12345678901234", status="active", last_visit="2025-04-28", total_orders=8, balance=0),
            PatientDB(code="P-1002", name="Fatima Ibrahim", name_ar="فاطمة إبراهيم حسن", age=34, gender="female", phone="011-9876-5432", national_id="23456789012345", status="pending", last_visit="2025-04-30", total_orders=3, balance=250),
            PatientDB(code="P-1003", name="Mohamed Hassan", name_ar="محمد حسن كريم", age=62, gender="male", phone="012-5555-7777", national_id="34567890123456", status="active", last_visit="2025-04-29", total_orders=15, balance=0),
            PatientDB(code="P-1004", name="Sara Youssef", name_ar="سارة يوسف نور", age=28, gender="female", phone="015-3333-9999", national_id="45678901234567", status="active", last_visit="2025-04-30", total_orders=2, balance=0),
        ]
        db.add_all(patients)
        orders = [
            OrderDB(code="ORD-001", patient_id="P-1001", patient_name="أحمد محمد علي", tests='["CBC","Blood Sugar","Lipid Profile"]', status="completed", priority="normal", total_amount=450, created_at="2025-04-30T08:00", due_at="2025-04-30T12:00"),
            OrderDB(code="ORD-002", patient_id="P-1002", patient_name="فاطمة إبراهيم حسن", tests='["Thyroid Panel","CBC","Vitamin D"]', status="in-progress", priority="normal", total_amount=780, created_at="2025-04-30T09:30", due_at="2025-04-30T14:00"),
            OrderDB(code="ORD-003", patient_id="P-1003", patient_name="محمد حسن كريم", tests='["HbA1c","Fasting Glucose","Kidney Function"]', status="pending", priority="normal", notes="متابعة داء السكري", total_amount=680, created_at="2025-04-30T11:00", due_at="2025-04-30T15:00"),
        ]
        db.add_all(orders)
        db.commit()
    db.close()

seed_db()


# ─── Dependency ───
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── FastAPI App ───
app = FastAPI(title="Sonet PMS API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://localhost:5173", "http://localhost:3000", "tauri://localhost", "https://tauri.localhost"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)


# ─── Schemas ───
class PatientCreate(BaseModel):
    name: str; name_ar: str; age: int; gender: str; phone: str; national_id: str
class PatientOut(BaseModel):
    id: int; code: str; name: str; name_ar: str; age: int; gender: str; phone: str; national_id: str; status: str; last_visit: str; total_orders: int; balance: float
    class Config: from_attributes = True

class OrderCreate(BaseModel):
    patient_id: str; patient_name: str; tests: List[str]; priority: Optional[str] = "normal"; notes: Optional[str] = None; total_amount: Optional[float] = 0.0
class OrderOut(BaseModel):
    id: int; code: str; patient_id: str; patient_name: str; tests: str; status: str; priority: str; notes: Optional[str]; total_amount: float; created_at: str; due_at: str
    class Config: from_attributes = True

class LoginRequest(BaseModel):
    email: str; password: str


# ─── Auth ───
@app.post("/api/auth/login")
async def login(req: LoginRequest):
    # TODO: real JWT auth
    if req.email and req.password:
        return {"token": "sonet-jwt-token", "user": {"name": "د. أحمد محمد", "role": "مدير المعمل", "email": req.email}}
    raise HTTPException(401, "بيانات الدخول غلط")


# ─── Health ───
@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": "0.3.0", "database": "sqlite", "timestamp": datetime.now().isoformat()}


# ─── Patients CRUD ───
@app.get("/api/patients")
async def list_patients(search: Optional[str] = None, page: int = 1, limit: int = 50, db: Session = Depends(get_db)):
    q = db.query(PatientDB)
    if search:
        q = q.filter((PatientDB.name_ar.contains(search)) | (PatientDB.code.contains(search)) | (PatientDB.phone.contains(search)))
    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()
    return {"data": items, "total": total}

@app.post("/api/patients", response_model=PatientOut)
async def create_patient(p: PatientCreate, db: Session = Depends(get_db)):
    count = db.query(PatientDB).count()
    patient = PatientDB(
        code=f"P-{1005 + count}", name=p.name, name_ar=p.name_ar, age=p.age, gender=p.gender,
        phone=p.phone, national_id=p.national_id, status="active", last_visit=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(patient); db.commit(); db.refresh(patient)
    return patient

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str, db: Session = Depends(get_db)):
    p = db.query(PatientDB).filter(PatientDB.code == patient_id).first()
    if not p: raise HTTPException(404, "Patient not found")
    return p

@app.delete("/api/patients/{patient_id}")
async def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    p = db.query(PatientDB).get(patient_id)
    if not p: raise HTTPException(404, "Patient not found")
    db.delete(p); db.commit()
    return {"message": "Deleted"}


# ─── Orders CRUD ───
@app.get("/api/orders")
async def list_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(OrderDB)
    if status: q = q.filter(OrderDB.status == status)
    return {"data": q.all(), "total": q.count()}

@app.post("/api/orders")
async def create_order(o: OrderCreate, db: Session = Depends(get_db)):
    import json
    count = db.query(OrderDB).count()
    order = OrderDB(
        code=f"ORD-{count + 1:04d}", patient_id=o.patient_id, patient_name=o.patient_name,
        tests=json.dumps(o.tests, ensure_ascii=False), status="pending", priority=o.priority,
        notes=o.notes, total_amount=o.total_amount,
        created_at=datetime.now().isoformat(), due_at=datetime.now().replace(hour=18).isoformat()
    )
    db.add(order); db.commit(); db.refresh(order)
    return {"data": order, "message": "Order created"}


# ─── Results (placeholder) ───
@app.get("/api/results") 
async def get_results(): return {"data": [], "total": 0}

# ─── Invoices (placeholder) ───
@app.get("/api/invoices")
async def get_invoices(): return {"data": [], "total": 0}

# ─── Dashboard ───
@app.get("/api/reports/summary")
async def dashboard_summary(db: Session = Depends(get_db)):
    return {
        "totalPatients": db.query(PatientDB).count(),
        "todayOrders": db.query(OrderDB).count(),
        "pendingResults": 3, "todayRevenue": 3215,
        "completionRate": 94, "urgentCases": 2,
    }

# ─── Voice ───
@app.post("/api/voice/process")
async def process_voice(cmd: dict):
    return {"transcript": cmd.get("transcript",""), "intent": "general", "response": "تمام يا دكتور، فهمت!", "confidence": 0.95}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
