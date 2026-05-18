from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from app.repositories.user_repository import (
    get_user_by_username,
    create_user
)

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)

    if not user:
        return None

    if not pwd_context.verify(password, user.password_hash):
        return None

    return user


def generate_token(user):
    return jwt.encode(
        {
            "sub": user.username,
            "role": user.role,
            "exp": datetime.now(timezone.utc) + timedelta(hours=2)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def register_user(db: Session, username: str, password: str):
    existing_user = get_user_by_username(db, username)

    if existing_user:
        raise ValueError("Usuário já existe")

    hashed_password = pwd_context.hash(password)
    return create_user(db, username, hashed_password)
