from sqlalchemy import Column, String, BigInteger, ForeignKey, DateTime
from app.database.connection import Base
from datetime import datetime, timezone

class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PlaylistTrack(Base):
    __tablename__ = "playlist_tracks"
    playlist_id = Column(BigInteger, ForeignKey("playlists.id"), primary_key=True)
    track_id = Column(BigInteger, ForeignKey("tracks.id"), primary_key=True)
    added_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
