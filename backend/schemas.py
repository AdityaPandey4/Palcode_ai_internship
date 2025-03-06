# backend/schemas.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

class LeaveRequestCreate(BaseModel):
    user_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str

class LeaveRequestUpdate(BaseModel):
    status: str

class LeaveRequest(LeaveRequestCreate):
    id: int
    status: Optional[str] = "PENDING"

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class User(UserCreate):
    id: int
    is_admin: bool = False

    class Config:
        orm_mode = True