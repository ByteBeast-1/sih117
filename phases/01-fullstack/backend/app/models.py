from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # 'admin' or 'user'


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, default="New Technical Session")
    agent = Column(String, default="orchestrator")  # orchestrator, analyzer, generator, sandbox
    user_id = Column(String, default="eng_rajesh")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")
    artifacts = relationship("Artifact", back_populates="conversation")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    role = Column(String)  # 'user', 'assistant', 'system'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(Text, nullable=True)  # JSON for thinking trace, extracted params

    conversation = relationship("Conversation", back_populates="messages")


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    file_type = Column(String)  # 'pdf', 'pptx', 'xlsx', 'tex', 'py', 'docx'
    file_path = Column(String)
    file_size = Column(Integer, default=0)  # bytes
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True)
    conversation_title = Column(String, nullable=True)
    agent = Column(String, default="generator")  # generator, analyzer, sandbox
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="artifacts")

