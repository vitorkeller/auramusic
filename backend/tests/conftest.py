import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.ext.compiler import compiles
from sqlalchemy import BigInteger
from app.main import app
from app.database.connection import Base
from app.database.deps import get_db
from app.services.auth_service import generate_token, pwd_context
from app.models.user import User
from app.models.track import Track, Album, Artist

@compiles(BigInteger, 'sqlite')
def compile_big_integer(element, compiler, **kw):
    return 'INTEGER'

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool 
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def test_db():
    db = TestingSessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def test_user(test_db):
    user = User(
        username="usuarioteste",
        password_hash=pwd_context.hash("senha123"),
        role="USER"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user

@pytest.fixture(scope="module")
def auth_headers(test_user):
    token = generate_token(test_user)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="module")
def test_track(test_db):
    artist = Artist(name="Artista Teste")
    test_db.add(artist)
    test_db.commit()

    album = Album(title="Album Teste", artist_id=artist.id)
    test_db.add(album)
    test_db.commit()

    track = Track(title="Música Teste", album_id=album.id, file_url="http://teste.com/som.mp3", duration_seconds=120)
    test_db.add(track)
    test_db.commit()
    test_db.refresh(track)
    
    return track
