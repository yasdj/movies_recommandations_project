import requests
import os

API_KEY = os.getenv("TMDB_KEY")
BASE_URL = "https://api.themoviedb.org/3"

GENRES = [
    {"id": 28, "name": "Action"},
    {"id": 12, "name": "Adventure"},
    {"id": 16, "name": "Animation"},
    {"id": 35, "name": "Comedy"},
    {"id": 80, "name": "Crime"},
    {"id": 99, "name": "Documentary"},
    {"id": 18, "name": "Drama"},
    {"id": 10751, "name": "Family"},
    {"id": 14, "name": "Fantasy"},
    {"id": 36, "name": "History"},
    {"id": 27, "name": "Horror"},
    {"id": 10402, "name": "Music"},
    {"id": 9648, "name": "Mystery"},
    {"id": 10749, "name": "Romance"},
    {"id": 878, "name": "Science Fiction"},
    {"id": 10770, "name": "TV Movie"},
    {"id": 53, "name": "Thriller"},
    {"id": 10752, "name": "War"},
    {"id": 37, "name": "Western"}
]

GENRE_MAP = {g["id"]: g["name"] for g in GENRES}

def get_recommendations(movie_id: int, limit: int = 5) -> list[dict]:
    resp = requests.get(
        f"{BASE_URL}/movie/{movie_id}/recommendations",
        params={"api_key": API_KEY, "language": "en-US", "page": 1}
    )
    resp.raise_for_status()
    return resp.json().get("results", [])[:limit]

def recommend_movies(selected_genres: list[str], movie_ids: list[int], per_movie_limit: int = 5) -> list[dict]:
    recommended = []
    recs = []

    for movie_id in movie_ids:
        recs.extend(get_recommendations(movie_id, per_movie_limit))

    for movie in recs:
        movie_genres = [GENRE_MAP[g] for g in movie.get("genre_ids", []) if g in GENRE_MAP]
        if set(selected_genres) & set(movie_genres):
            recommended.append({
                "id": movie.get("id"),
                "title": movie["title"],
                "overview": movie["overview"],
                "posterPath": movie["poster_path"],
                "releaseDate": movie["release_date"],
                "genres": movie_genres
            })

    seen = set()
    final = []
    for r in recommended:
        if r["title"] not in seen and r["id"] not in movie_ids:
            seen.add(r["title"])
            final.append(r)
    return final[:10]

