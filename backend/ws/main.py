from fastapi import FastAPI, WebSocket
from common import redis
import asyncio
import json
import uvicorn

app = FastAPI()

@app.websocket("/ws/{job_id}")
async def websocket_endpoint(ws: WebSocket, job_id: str):
    await ws.accept()
    print("connection established")
    pubsub = redis.redis_connection.pubsub()
    pubsub.subscribe("job_updates")

    try:
        async for message in listen(pubsub, job_id):
            await ws.send_json(message)
    except Exception as e:
        print("Websocket closed: ", e)
    finally:
        pubsub.close()
    
async def listen(pubsub, job_id):
    loop = asyncio.get_running_loop()
    while True:
        msg = await loop.run_in_executor(None, pubsub.get_message, True, 1)
        if msg and msg["type"] =="message":
            data = json.loads(msg["data"])
            if data["job_id"] == job_id:
                yield data


if __name__ == "__main__":
    print("websocket running")
    uvicorn.run("ws.main:app", host="0.0.0.0", port=8000)