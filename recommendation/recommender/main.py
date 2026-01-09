import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from recommender_system import recommend_movies
from database import pool

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Database pool is ready")
    yield
    pool.close()
    print("Database pool closed")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommendations")
async def get_recommendations(request: Request):
    body = await request.json()
    genres = body.get("genres", [])
    watched = body.get("watched", [])

    recs = recommend_movies(genres, watched)
    if not recs:
        raise HTTPException(status_code=404, detail="No recommendations found")
    return recs


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("recommender.main:app", host="0.0.0.0", port=port, reload=True)
