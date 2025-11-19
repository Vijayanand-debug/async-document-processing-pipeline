import os
from openai import OpenAI
from common import prompts, redis
from worker.services import db 

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_chunks(job_id: str, chunks: list):
    summaries = []
    for chunk_index, chunk in enumerate(chunks):
        current_chunk_summary = summarize_individual_chunk(chunk)

        db.insert_chunk(job_id, chunk_index, chunk, current_chunk_summary, 'completed')

        summaries.append(current_chunk_summary)

        redis.publish_update(job_id, 5, 'summarized_chunk', chunk_index)

    return summaries


def summarize_individual_chunk(text: str):
    if not text:
        return "No content found."

    prompt = prompts.chunk_summary_prompt + f"\n\n Document Chunk : {text}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content

def final_summary(job_id: str, summaries: list[str]) -> str:
    if not summaries:
        return "No content found."

    joined_summaries = "\n\n".join([f"Chunk {index+1}: {summary}" for index, summary in enumerate(summaries)])
    prompt = prompts.final_summary_prompt + f"\n\n Summaries: \n {joined_summaries} "

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    final_summary = response.choices[0].message.content

    db.update_job_final_summary(job_id, 5, final_summary)

    redis.publish_update(job_id, 5, 'final_summary')

    return final_summary
    