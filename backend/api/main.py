from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import process, summaries

app = FastAPI()

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process.router)
app.include_router(summaries.router)