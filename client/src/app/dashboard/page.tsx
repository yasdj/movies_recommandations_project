"use client";

import styles from "../../styles/dashboard.module.css";
import { useState } from "react";
import Image from "next/image";
import { getRecommendation } from "../api/api";

interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
}

const allGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "TV Movie",
  "War",
  "Western",
];

export default function Dashboard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 - Genre selection
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const toggleGenre = (genre: string) => {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre]
    );
  };

  // Step 2 - Watched movies
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<TmdbMovie[]>([]);

  const [recommendations, setRecommendations] = useState<[]>([]);

  const searchRecommendations = async () => {
    if (watchedMovies.length === 0) return;
    if (selectedGenres.length === 0) return;

    try {
      const recommendations: [] = await getRecommendation("/recommendations", {
        watched: watchedMovies.map((m) => m.id),
        genres: selectedGenres,
      });
      if (recommendations.length > 0) {
        setRecommendations(recommendations);
        setStep(3);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };

  const resetStates = () => {
    setStep(1);
    setSelectedGenres([]);
    setWatchedMovies([]);
    setSearchTerm("");
    setSearchResults([]);
    setRecommendations([]);
  };

  const searchMovies = async (query: string) => {
    if (!query) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/tmdb/search?query=${encodeURIComponent(
          query
        )}`,
        { credentials: "include" } // optional, but fine if you use cookies elsewhere
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Failed to search movies:", err);
    }
  };

  // Toggle film dans la liste watchedMovies
  const toggleWatchedMovie = (movie: TmdbMovie) => {
    setWatchedMovies((prev) => {
      if (prev.find((m) => m.id === movie.id)) {
        // Film déjà marqué, on le retire
        return prev.filter((m) => m.id !== movie.id);
      } else {
        // Film absent, on l'ajoute
        return [...prev, movie];
      }
    });
  };

  return (
    <div className={styles.container}>
      {step === 1 && (
        <>
          <h1>Which categorie(s) do you prefer?</h1>

          <div className={styles.grid}>
            {allGenres.map((genre) => (
              <div
                key={genre}
                className={`${styles.card} ${
                  selectedGenres.includes(genre) ? styles.active : ""
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </div>
            ))}
          </div>

          <p className={styles.selected}>
            Selected:{" "}
            {selectedGenres.length > 0 ? selectedGenres.join(", ") : "None"}
          </p>

          <div className={styles.selectWatchedButton}>
            <button
              className={styles.nextButton}
              onClick={() => setStep(2)}
              disabled={selectedGenres.length === 0}
            >
              Select watched movies
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <button
            className={styles.nextButton}
            onClick={searchRecommendations}
            disabled={watchedMovies.length === 0 || selectedGenres.length === 0}
          >
            Get Recommendations
          </button>

          <h1>Which movies have you already watched?</h1>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchMovies(searchTerm);
                }
              }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.grid}>
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className={`${styles.card} ${
                  watchedMovies.find((m) => m.id === movie.id)
                    ? styles.active
                    : ""
                }`}
                onClick={() => toggleWatchedMovie(movie)}
              >
                {movie.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    width={200}
                    height={300}
                    className={styles.poster}
                  />
                )}
                <div>
                  {movie.title} ({movie.release_date?.slice(0, 4)})
                </div>
              </div>
            ))}
          </div>
          <div className={styles.watched}>
            <h3>You&apos;ve marked these as watched:</h3>
            <ul className={styles.watchedList}>
              {watchedMovies.map((m) => (
                <li key={m.id}>
                  {m.title} ({m.release_date?.slice(0, 4)})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {step === 3 && (
        <div>
          <button onClick={resetStates}>New recommendations</button>
          <h1>Your Movie Recommendations</h1>
          <div className={styles.movieContainer}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              recommendations.map((movie: any) => (
                <div key={movie.id} className={styles.movies}>
                  {movie.posterPath && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        movie.posterPath
                          ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                          : "/noPhoto.jpg"
                      }
                      alt={movie.title}
                      className={styles.poster}
                    />
                  )}
                  <div className={styles.movieTitle}>
                    {movie.title} ({movie.releaseDate?.slice(0, 4)})
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
