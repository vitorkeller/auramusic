from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.security import get_current_user
from app.routes.auth import router as auth_router
from app.routes.tracks import router as tracks_router
from app.routes.protected import router as protected_router
from app.routes.favorites import router as favorites_router
from app.routes.playlists import router as playlists_router
from app.routes.profile import router as profile_router

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

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(tracks_router)
app.include_router(protected_router)
app.include_router(favorites_router)
app.include_router(playlists_router)
app.include_router(profile_router)

@app.get("/")
def root(user=Depends(get_current_user)):
    return {"message": "API protegida"}
