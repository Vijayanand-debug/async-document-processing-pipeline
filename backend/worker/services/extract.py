import os
from common import s3_utils, config, redis
from worker.services import db
import fitz
import tiktoken 

def extract_text(job: dict):
    job_id = job["job_id"]
    user_id = job.get("user_id")
    s3_key = job.get("s3_key")

    text = None
    if s3_key:
        text = extract_text_from_doc(job_id, s3_key)
    else:
        text = fetch_user_input(job_id)

    redis.publish_update(job_id, 4, 'extraction_completed')

    return text

def extract_text_from_doc(job_id: str, s3_key: str):
    local_path = s3_utils.download_docs(job_id, s3_key)

    text = []
    with fitz.open(local_path) as document:
        for each_page in document:
            text.append(each_page.get_text("text"))
    return "\n".join(text)

def fetch_user_input(job_id: str):
    text = db.get_job_text_input(job_id)
    return text

def divide_text_into_chunks(job_id: str, text: str):
    try:
        encode_tokens = tiktoken.get_encoding("cl100k_base")
        tokens = encode_tokens.encode(text)

        chunk_size = 400
        overlap = 40

        chunks = []
        start = 0

        if len(tokens) < 600:
            return [text]

        while start < len(tokens):
            end = start + chunk_size
            chunk_tokens = tokens[start: end]
            chunk_text = encode_tokens.decode(chunk_tokens)
            chunks.append(chunk_text)

            start += chunk_size - overlap

        redis.publish_update(job_id, 5, 'llm_processing')
        return chunks

    except Exception as e:
        print("[Worker] Error processing message:", e)
        return []
