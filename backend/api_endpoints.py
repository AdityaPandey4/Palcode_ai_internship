from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import get_db

router = APIRouter()  # Use router instead of app

@router.post("/", response_model=schemas.LeaveRequest)
def create_leave_request(request: schemas.LeaveRequestCreate, db: Session = Depends(get_db)):
    return crud.create_leave_request(db=db, request=request)

@router.get("/", response_model=List[schemas.LeaveRequest])
def read_leave_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    leave_requests = crud.get_leave_requests(db, skip=skip, limit=limit)
    return leave_requests

@router.get("/users/{user_id}/leave-requests/", response_model=List[schemas.LeaveRequest])
def read_user_leave_requests(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_leave_requests(db, user_id=user_id)

@router.put("/leave-requests/{request_id}/", response_model=schemas.LeaveRequest)
def update_leave_request(request_id: int, status: schemas.LeaveRequestUpdate, db: Session = Depends(get_db)):
    return crud.update_leave_request(db=db, request_id=request_id, status=status)