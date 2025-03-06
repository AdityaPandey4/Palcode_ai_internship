# backend/crud.py
from sqlalchemy.orm import Session
import models
import schemas

def create_leave_request(db: Session, request: schemas.LeaveRequestCreate):
    db_request = models.LeaveRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_leave_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LeaveRequest).offset(skip).limit(limit).all()

def get_user_leave_requests(db: Session, user_id: int):
    return db.query(models.LeaveRequest).filter(
        models.LeaveRequest.user_id == user_id
    ).all()

def update_leave_request(db: Session, request_id: int, status: schemas.LeaveRequestUpdate):
    db_request = db.query(models.LeaveRequest).filter(
        models.LeaveRequest.id == request_id
    ).first()
    if not db_request:
        return None
    db_request.status = status.status
    db.commit()
    db.refresh(db_request)
    return db_request