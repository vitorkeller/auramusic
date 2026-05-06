from fastapi import FastAPI, Depends
from app.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.protected import router as protected_router
from app.core.security import get_current_user

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://auramusic-liart.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(protected_router)
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def root(user=Depends(get_current_user)):
    return {"message": "API protegida"}
