import boto3
import os
from common import config

# A reusable S3 client
s3 = boto3.client(
    "s3",
    region_name=config.AWS_REGION
)

def upload_file(local_path: str, bucket_name: str, s3_key: str) -> str:
    
    s3.upload_file(local_path, bucket_name, s3_key)
    return f"s3://{bucket_name}/{s3_key}"

def upload_file_obj(file, bucket_name: str, s3_key: str) -> str:

    s3.upload_fileobj(file.file, bucket_name, s3_key)
    return f"s3://{bucket_name}/{s3_key}"

def download_docs(job_id, s3_key: str):

    # for docker
    local_path = f"/tmp/{job_id}_{os.path.basename(s3_key)}"

    s3.download_file(config.S3_BUCKET_UPLOADS, s3_key, local_path)
    return local_path
