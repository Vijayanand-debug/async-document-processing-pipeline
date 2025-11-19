import uuid
import json
import os
import enum
from fastapi import APIRouter, UploadFile, File, Form, Request, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
from common import s3_utils, sqs_utils, config, models
from common.db import SessionLocal
from common.models import Job, Chunk
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import ENUM

class PipelineStatus(enum.Enum):
    pending = 'pending'
    extract = 'extract'
    summarize = 'summarize'
    classify = 'classify' 

router = APIRouter()

def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/jobs/{job_id}/chunks/{chunk_index}")
async def get_job_chunks(job_id: str, chunk_index: int, db=Depends(db_session)):
    """
    - This endpoint accetps job id and chunk index as query params
    - Returns individual chunk summaries
    """
    try:
        chunk = (
            db.query(Chunk)
            .filter(Chunk.job_id == job_id)
            .filter(Chunk.chunk_index == chunk_index)
            .first()
        )

        if not chunk:
            return {"error": "chunk_not_found"}

        return {
            "chunk_index": chunk.chunk_index,
            "chunk": chunk.chunk,
            "summary": chunk.summary,
            "status": chunk.status,
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/api/jobs/{job_id}/summary")
async def get_final_summary(job_id: str, db=Depends(db_session)):
    """
    - This endpoint accetps job id params
    - Returns final summary of the entire document or custom text
    """
    try:
        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return {"error": "job_not_found"}

        return {
            "job_id": job_id,
            "final_summary": job.final_summary,
            "classification": job.classification,
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/api/jobs/{job_id}/complete_job_data")
async def get_complete_job_data(job_id: str, db=Depends(db_session)):
    """
    - This endpoint accetps job id params
    - Returns the complete job details
    """

    job = (
        db.query(Job)
        .options(joinedload(Job.chunks))
        .filter(Job.id == job_id)
        .first()
    ) 

    if not job:
       return {"error": "job_not_found"}

    return models.Complete_Job_Data(
        job_id=str(job.id),
        current_step=job.current_step,
        status=job.status.value if isinstance(job.status, enum.Enum) else job.status,
        classification=job.classification,
        final_summary=job.final_summary,
        chunks=[{"index": chunk.chunk_index, "summary": chunk.summary} for chunk in job.chunks]
    )