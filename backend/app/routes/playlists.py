from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.database.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.track import Track
from app.models.playlist import Playlist, PlaylistTrack

router = APIRouter(prefix="/api/playlists", tags=["Playlists"])

class PlaylistCreate(BaseModel):
    name: str
    color: str
    tracks: List[int]

@router.get("/")
def get_user_playlists(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    playlists = db.query(Playlist).filter(Playlist.user_id == user.id).order_by(Playlist.created_at.desc()).all()

    result = []
    for p in playlists:
        track_count = db.query(PlaylistTrack).filter(PlaylistTrack.playlist_id == p.id).count()
        result.append({
            "id": p.id,
            "title": p.name,
            "color": p.color,
            "tracks": track_count
        })
    return result

@router.post("/")
def create_playlist(data: PlaylistCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    
    new_playlist = Playlist(name=data.name, color=data.color, user_id=user.id)
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)

    for track_id in data.tracks:
        pt = PlaylistTrack(playlist_id=new_playlist.id, track_id=track_id)
        db.add(pt)
    
    db.commit()
    return {"message": "Playlist criada", "id": new_playlist.id}

@router.get("/{playlist_id}")
def get_playlist_details(playlist_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.user_id == user.id).first()
    
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist não encontrada")

    pts = db.query(PlaylistTrack).filter(PlaylistTrack.playlist_id == playlist.id).all()
    track_ids = [pt.track_id for pt in pts]
    
    tracks = db.query(Track).filter(Track.id.in_(track_ids)).all() if track_ids else []

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

    return {
        "id": playlist.id,
        "title": playlist.name,
        "color": playlist.color,
        "songs": formatted_tracks
    }

@router.delete("/{playlist_id}")
def delete_playlist(playlist_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["sub"]).first()
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.user_id == user.id).first()
    
    if playlist:
        db.query(PlaylistTrack).filter(PlaylistTrack.playlist_id == playlist.id).delete()
        db.delete(playlist)
        db.commit()
    return {"message": "Deletado com sucesso"}
