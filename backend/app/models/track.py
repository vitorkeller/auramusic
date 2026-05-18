from sqlalchemy import Column, String, BigInteger, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Artist(Base):
    __tablename__ = "artists"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    bio = Column(String)
    image_url = Column(String)

class Album(Base):
    __tablename__ = "albums"
    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String, nullable=False)
    artist_id = Column(BigInteger, ForeignKey("artists.id"))
    release_date = Column(Date)
    cover_image_url = Column(String)

    artist = relationship("Artist")

class Track(Base):
    __tablename__ = "tracks"
    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String, nullable=False)
    album_id = Column(BigInteger, ForeignKey("albums.id"))
    category_id = Column(BigInteger, ForeignKey("categories.id"), nullable=True)
    file_url = Column(String, nullable=False)
    duration_seconds = Column(Integer)

    album = relationship("Album")

class Category(Base):
    __tablename__ = "categories"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
