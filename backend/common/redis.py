import redis
import json

redis_connection = redis.Redis(host="redis", port=6379, decode_responses=True)

def publish_update(job_id, step, status, extra=None):
    message = {
        "job_id": job_id,
        "current_step": step,
        "status": status,
        "extra" : extra
    }

    redis_connection.publish("job_updates", json.dumps(message))

