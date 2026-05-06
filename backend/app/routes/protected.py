from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(
    prefix="/api",
    tags=["Protected"]
)

@router.get("/profile")
def profile(user = Depends(get_current_user)):
    return {
    "user": {
        "username": user["sub"],
        "role": user["role"]
    	}
	}

@router.get("/dashboard")
def dashboard(user = Depends(get_current_user)):
    return {"msg": f"Bem-vindo {user['sub']}"}
