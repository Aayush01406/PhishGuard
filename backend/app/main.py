from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .core.database import Base, engine
from .api import scans, blocked_domains

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PhishGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scans.router)
app.include_router(blocked_domains.router)


@app.get("/")
def root():
    return {"message": "PhishGuard API is running!"}


@app.get("/health")
def health():
    return {"status": "healthy"}
