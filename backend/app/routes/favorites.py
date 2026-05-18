from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.track import Track
from app.models.favorite import FavoriteTrack

router = APIRouter(
    prefix="/api/favorites",
    tags=["Favorites"]
)

@router.get("/")
def get_favorites(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    favorites = db.query(FavoriteTrack).filter(FavoriteTrack.user_id == user.id).all()
    track_ids = [f.track_id for f in favorites]

    if not track_ids:
        return []

    tracks = db.query(Track).filter(Track.id.in_(track_ids)).all()

    formatted_tracks = []
    for t in tracks:
        mins = t.duration_seconds // 60 if t.duration_seconds else 0
        secs = t.duration_seconds % 60 if t.duration_seconds else 0
        
        formatted_tracks.append({
            "id": t.id,
            "title": t.title,
            "artist": t.album.artist.name if t.album and t.album.artist else "Desconhecido",
            "album": t.album.title if t.album else "Single",
            "duration": f"{mins}:{secs:02d}",
            "cover": t.album.cover_image_url if t.album else "from-gray-700 to-gray-900",
            "file_url": t.file_url
        })
        
    return formatted_tracks

@router.post("/{track_id}")
def add_favorite(track_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    
    existing = db.query(FavoriteTrack).filter_by(user_id=user.id, track_id=track_id).first()
    if not existing:
        new_fav = FavoriteTrack(user_id=user.id, track_id=track_id)
        db.add(new_fav)
        db.commit()
        
    return {"message": "Adicionado aos favoritos"}

@router.delete("/{track_id}")
def remove_favorite(track_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    
    existing = db.query(FavoriteTrack).filter_by(user_id=user.id, track_id=track_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        
    return {"message": "Removido dos favoritos"}
