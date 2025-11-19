import uuid
import json
import os
from fastapi import APIRouter, UploadFile, File, Form, Request, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
from common import s3_utils, sqs_utils, config
from common.db import SessionLocal
from common.models import Job, Chunk
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone

router = APIRouter()

def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def upload_file_to_s3(job_id, file: UploadFile, file_type: str):
    try:
        s3_key = f"input/{job_id}/{file_type}_{file.filename}"
        s3_url = s3_utils.upload_file_obj(
            file,
            config.S3_BUCKET_UPLOADS, 
            s3_key 
        )

        return s3_key
    except:
        return None

async def save_meta_to_db(job_id, user_id, file, file_type, text, db):
    if file_type is None or len(file_type) == 1:
        s3_key = None
    else:
        s3_key = await upload_file_to_s3(job_id, file, file_type)
    
    try:
        job_row = Job(
            id=job_id, 
            user_id=user_id, 
            doc_upload_key=s3_key,
            text_input=text, 
            job_metadata={}, 
            status="extract",
            current_step = 0
        )
        db.add(job_row)
        db.commit()
        return s3_key
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False
    except Exception as error:
        print(error)
        return False

async def push_message_to_sqs(job_id, user_id, s3_key, db):
    message = {
        "job_id": str(job_id),
        "user_id": user_id,
        "uploads_bucket": config.S3_BUCKET_UPLOADS,
        "s3_key": s3_key,
        "steps": ["extract", "summarize", "classify"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    try:
        sqs_resp = sqs_utils.send_message(message)
        return True
    except Exception as e:
        print("SQS send failed:", e)
        try:
            job_row = db.query(Job).filter(Job.id == job_id).first()
            if job_row:
                job_row.status = "sqs_failed"
                db.add(job_row)
                db.commit()
            else:
                return False
        except Exception as db_err:
            db.rollback()
        return False

@router.post("/api/process")
async def process_endpoint(
    request: Request,
    user_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    file_type: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    db = Depends(db_session)
):
    """
    This endpoint accetps multipart form data:
      - user_id (string), created on the client side
      - file (file), upload files and are optional
      - file_type (string), if files are uploaded, file type will be posted
      - text (string), optional, custom text entered by user
    This is the entry point to start the pipeline process
    """
    try:
        # create job_id
        job_id = uuid.uuid4()

        # save metadata to postgres
        db_step_result = await save_meta_to_db(job_id, user_id, file, file_type, text, db)

        if not db_step_result and len(text) < 1:
            return JSONResponse({"ok": False, "error": "db_error"}, status_code=500)

        # push message to sqs
        sqs_push_result = await push_message_to_sqs(job_id, user_id, db_step_result, db)
        if not sqs_push_result:
            return JSONResponse({"ok": False, "error": "sqs_error"}, status_code=500)

        return JSONResponse({"ok": True, "message": "success", "job_id": str(job_id), "current_step": 2}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse({"ok": False, "error": "something went wrong! please try again later"}, status_code=500)