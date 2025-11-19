DO $$ BEGIN
    CREATE TYPE pipeline_status AS ENUM('pending','extract', 'summarize', 'classify', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    doc_upload_key VARCHAR(250) NULL,
    text_input TEXT NULL,
    job_metadata JSONB DEFAULT '{}',
    current_step INT DEFAULT 0,
    status pipeline_status DEFAULT 'pending',
    final_summary TEXT,
    classification TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

CREATE TABLE IF NOT EXISTS chunks (
    id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE, 
    chunk_index INT NOT NULL,
    chunk TEXT NULL,
    summary TEXT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chunks_job_id ON chunks(job_id);
