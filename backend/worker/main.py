import json, time, tempfile, os
from common import config, sqs_utils, redis
from worker.services import extract, summarize, classify, db 

# process the job at hand
def process_job(job: dict):
    job_id = job["job_id"]

    # using lambda for convenience, regular functions can also be passed as args.
    text = execute_pipeline_step(job_id, 4, lambda: extract.extract_text(job))
    chunks = execute_pipeline_step(job_id, 4, lambda: extract.divide_text_into_chunks(job_id, text))
    chunks_summaries = execute_pipeline_step(job_id, 5, lambda: summarize.summarize_chunks(job_id, chunks))
    final_summary = execute_pipeline_step(job_id, 5, lambda: summarize.final_summary(job_id, chunks_summaries))
    category = execute_pipeline_step(job_id, 5, lambda: classify.classify_text(job_id, final_summary))

# a resuable function to catch all errors at one place
def execute_pipeline_step(job_id, step_name, function):
    try:
        return function()
    except Exception as e:
        handle_error(job_id, step_name, str(e))
        raise

def handle_error(job_id, step, msg):
    print(f"Pipeline Error: {job_id} at {step}: {msg}")
    redis.publish_update(job_id, step, "error", msg)
    db.update_job_error(job_id, step, msg)

def main():
    print("Worker running...")
    while True:
        messages = sqs_utils.receive_messages()
        if not messages:
            time.sleep(5)
            continue

        for msg in messages:
            try:
                body = json.loads(msg["Body"])
                process_job(body)
                sqs_utils.delete_message(msg)
            except Exception as e:
                print("[Worker] Error processing message:", e)
        time.sleep(5)

if __name__ == "__main__":
    main()
