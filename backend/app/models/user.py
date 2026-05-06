from sqlalchemy import Column, String, BigInteger
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String)
    password_hash = Column(String)
    role = Column(String)
