from sqlalchemy import Column, BigInteger, ForeignKey, DateTime
from app.database.connection import Base
from datetime import datetime, timezone

class FavoriteTrack(Base):
    __tablename__ = "favorite_tracks"
    
    user_id = Column(BigInteger, ForeignKey("users.id"), primary_key=True)
    track_id = Column(BigInteger, ForeignKey("tracks.id"), primary_key=True)
    added_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
