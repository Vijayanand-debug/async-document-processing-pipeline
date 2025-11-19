from common.db import SessionLocal
from common.models import Job, Chunk
from sqlalchemy.exc import SQLAlchemyError

db = SessionLocal()

def insert_chunk(job_id, chunk_index, chunk, current_chunk_summary, status):
    try:
        chunk_row = Chunk(
            job_id=job_id, 
            chunk_index=chunk_index,
            chunk=chunk,
            summary=current_chunk_summary,
            status=status,
        )
        db.add(chunk_row)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False
    finally:
        db.close()

def update_job_final_summary(job_id, current_step, final_summary):
    try:
        job_row = db.query(Job).filter(
            Job.id == job_id,
        ).first()

        if not job_row:
            return False

        job_row.final_summary = final_summary
        job_row.current_step = current_step
        job_row.status = "summarize"

        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False
    finally:
        db.close()

def update_job_classification(job_id, current_step, category):
    try:
        job_row = db.query(Job).filter(
            Job.id == job_id,
        ).first()

        if not job_row:
            return False

        job_row.classification = category
        job_row.current_step = current_step
        job_row.status = "classify"

        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False
    finally:
        db.close()

def get_job_text_input(job_id):
    try:
        job = db.query(Job).filter(Job.id == job_id).first()

        if not job:
            return None

        return job.text_input

    except SQLAlchemyError as e:
        print(e)
        return None
    finally:
        db.close()

def update_job_error(job_id, step, message):
    try:
        job_row = db.query(Job).filter(
            Job.id == job_id,
        ).first()

        if not job_row:
            return False

        job_row.current_step = step
        job_row.final_summary = message
        job_row.status = "failed"

        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False
    finally:
        db.close()