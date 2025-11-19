import boto3, os, json
from common import config

sqs = boto3.client("sqs", region_name=config.AWS_REGION)

def send_message(payload: dict):
    return sqs.send_message(QueueUrl=config.SQS_URL, MessageBody=json.dumps(payload))

def receive_messages():
    resp = sqs.receive_message(
        QueueUrl=config.SQS_URL,
        MaxNumberOfMessages=1,
        WaitTimeSeconds=10
    )
    return resp.get("Messages", [])

def delete_message(msg):
    sqs.delete_message(QueueUrl=config.SQS_URL, ReceiptHandle=msg["ReceiptHandle"])
