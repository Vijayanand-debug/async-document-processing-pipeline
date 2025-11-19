import os
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_UPLOADS = os.getenv("S3_BUCKET_UPLOADS")
SQS_URL = os.getenv("SQS_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_PORT = int(os.getenv("API_PORT", 8000))
CHUNK_SIZE_TOKENS = os.getenv("CHUNK_SIZE_TOKENS")
CHUNK_OVERLAP = os.getenv("CHUNK_OVERLAP")