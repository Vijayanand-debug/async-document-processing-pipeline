import os
from openai import OpenAI
from common import prompts, redis
from worker.services import db 

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def classify_text(job_id:str, summary: str):
    prompt = prompts.classify_prompt + f"\n\n{summary}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    category = response.choices[0].message.content.strip()

    db.update_job_classification(job_id, 6, category)

    redis.publish_update(job_id, 6, 'completed')