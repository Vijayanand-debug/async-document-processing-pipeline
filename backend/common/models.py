import enum
from sqlalchemy import Column, Integer, Text, TIMESTAMP, String, DateTime, text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ENUM
from sqlalchemy.sql import func
from sqlalchemy import text
from common.db import Base
from pydantic import BaseModel
from typing import List, Optional

class PipelineStatus(enum.Enum):
    pending = 'pending'
    extract = 'extract'
    summarize = 'summarize'
    classify = 'classify' 
    failed = 'failed'

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(String(30), nullable=False)
    doc_upload_key = Column(String(250), nullable=True)
    text_input = Column(Text, nullable=True)
    job_metadata = Column(JSONB, server_default=text("'{}'::jsonb"))
    current_step = Column(Integer, nullable=False, server_default="0")
    status = Column(ENUM(PipelineStatus, name="pipeline_status"), nullable=False, server_default="pending")
    final_summary = Column(Text, nullable=True)
    classification = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True),server_default=text("CURRENT_TIMESTAMP"))

    chunks = relationship(
        "Chunk",
        back_populates="job",
        cascade="all, delete-orphan"
    )

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"))
    chunk_index = Column(Integer, nullable=False)
    chunk = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, server_default="pending")
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    job = relationship("Job", back_populates="chunks")

class Chunk_List(BaseModel):
    index: int
    summary: str

    model_config = {
        "from_attributes": True 
    }


class Complete_Job_Data(BaseModel):
    job_id: str
    current_step: int
    status: str
    classification: Optional[str]
    final_summary: Optional[str]
    chunks: List[Chunk_List]

    model_config = {
        "from_attributes": True   
    }