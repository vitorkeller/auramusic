import os
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv
from app.database.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.playlist import Playlist
from app.models.favorite import FavoriteTrack

load_dotenv()

cloudinary.config(secure=True)

router = APIRouter(prefix="/api/profile", tags=["Profile"])

class ProfileUpdate(BaseModel):
    display_name: str
    bio: str

@router.get("/")
def get_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    
    playlists_count = db.query(Playlist).filter(Playlist.user_id == user.id).count()
    likes_count = db.query(FavoriteTrack).filter(FavoriteTrack.user_id == user.id).count()

    return {
        "display_name": user.display_name,
        "bio": user.bio,
        "photo_url": user.photo_url,
        "playlist_count": playlists_count,
        "liked_count": likes_count
    }

@router.put("/")
def update_profile_text(data: ProfileUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    
    user.display_name = data.display_name
    user.bio = data.bio
    db.commit()
    
    return {"message": "Perfil atualizado com sucesso"}

@router.post("/photo")
async def upload_photo(file: UploadFile = File(...), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    
    try:
        result = cloudinary.uploader.upload(
            file.file,
            public_id=f"auramusic/avatars/user_{user.id}",
            overwrite=True,
            resource_type="image"
        )
        
        secure_url = result.get("secure_url")
        
        user.photo_url = secure_url
        db.commit()
        
        return {"photo_url": secure_url}
        
    except Exception as e:
        print(f"Erro no Cloudinary: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao fazer upload da imagem")
