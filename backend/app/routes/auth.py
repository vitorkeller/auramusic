from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.deps import get_db
from app.schemas.user_schema import LoginRequest, RegisterRequest
from app.services.auth_service import (
    authenticate_user,
    generate_token,
    register_user
)

router = APIRouter()


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.username, data.password)

    if not user:
        raise HTTPException(status_code=400, detail="Credenciais inválidas")

    token = generate_token(user)

    return {
        "token": token,
        "username": user.username,
        "role": user.role
    }


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user = register_user(db, data.username, data.password)

        return {
            "message": "Usuário criado",
            "username": user.username
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
