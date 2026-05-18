from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.deps import get_db
from app.models.track import Track
from app.core.security import get_current_user

router = APIRouter(
    prefix="/api/tracks",
    tags=["Tracks"]
)

@router.get("/")
def get_all_tracks(db: Session = Depends(get_db), user=Depends(get_current_user)):
    tracks_db = db.query(Track).all()
    
    formatted_tracks = []
    
    for t in tracks_db:
        if t.duration_seconds:
            mins = t.duration_seconds // 60
            secs = t.duration_seconds % 60
            duration_str = f"{mins}:{secs:02d}"
        else:
            duration_str = "0:00"

        formatted_tracks.append({
            "id": t.id,
            "title": t.title,
            "artist": t.album.artist.name if t.album and t.album.artist else "Desconhecido",
            "album": t.album.title if t.album else "Single",
            "duration": duration_str,
            "cover": t.album.cover_image_url if t.album else "from-gray-700 to-gray-900",
            "file_url": t.file_url
        })
        
    return formatted_tracks
