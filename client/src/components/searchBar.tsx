"use client";
import Image from "next/image";
import styles from "../styles/header.module.css";
import { FaEye, FaClock } from "react-icons/fa";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { del, get, post } from "app/app/api/api";
import { CiSearch } from "react-icons/ci";

interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<string[]>([]);
  const [laterMovies, setLaterMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  const searchMovies = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3001/api/tmdb/search?query=${encodeURIComponent(
          query
        )}`
      );

      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Failed to search movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWatchedTooltip = (movie: TmdbMovie) =>
    watchedMovies.includes(movie.id.toString())
      ? "Remove from watched list"
      : "Already watched";

  const getLaterTooltip = (movie: TmdbMovie) =>
    laterMovies.includes(movie.id.toString())
      ? "Remove from watch later list"
      : "Watch later";

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        searchMovies(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (!userId) return;

    const fetchLists = async () => {
      try {
        const watched: string[] = await get(`/api/user/${userId}/watched`);
        setWatchedMovies(watched);

        const later: string[] = await get(`/api/user/${userId}/later`);
        setLaterMovies(later);
      } catch (err) {
        console.error("Failed to load user movie lists:", err);
      }
    };

    fetchLists();
  }, [userId]);

  const toggleWatchedMovie = async (movie: TmdbMovie) => {
    if (!userId) return;
    const isInList = watchedMovies.includes(movie.id.toString());

    if (isInList) {
      await del(`/api/user/${userId}/${movie.id}/watched`);
      setWatchedMovies((prev) => prev.filter((m) => m !== movie.id.toString()));
    } else {
      await post(`/api/user/${userId}/watched`, {
        movieId: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
      });
      setWatchedMovies((prev) => [...prev, movie.id.toString()]);
    }
  };

  const toggleLaterMovie = async (movie: TmdbMovie) => {
    if (!userId) return;
    const isInList = laterMovies.includes(movie.id.toString());

    if (isInList) {
      await del(`/api/user/${userId}/${movie.id}/later`);
      setLaterMovies((prev) => prev.filter((m) => m !== movie.id.toString()));
    } else {
      await post(`/api/user/${userId}/later`, {
        movieId: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
      });
      setLaterMovies((prev) => [...prev, movie.id.toString()]);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputBox}>
        <CiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${styles.input} ${poppins.className}`}
        />
      </div>

      {searchTerm && (
        <div className={styles.searchOverlay}>
          {loading && <p>Chargement...</p>}

          {!loading && searchResults.length === 0 && (
            <p>Aucun film ne correspond à la recherche</p>
          )}

          <div className={styles.grid}>
            {searchResults.map((movie) => (
              <div key={movie.id} className={styles.card}>
                <div className={styles.posterWrapper}>
                  <Image
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "/noPhoto.jpg"
                    }
                    alt={movie.title}
                    width={200}
                    height={300}
                    className={`${styles.poster} ${
                      !movie.poster_path ? styles.noPoster : ""
                    }`}
                  />

                  <div className={styles.overlay}>
                    <div className={styles.iconWrapper}>
                      <FaEye
                        className={`${styles.icon} ${
                          watchedMovies.includes(movie.id.toString())
                            ? styles.activeIcon
                            : ""
                        }`}
                        onClick={() => toggleWatchedMovie(movie)}
                      />
                      <span className={styles.tooltip}>
                        {getWatchedTooltip(movie)}
                      </span>
                    </div>

                    <div className={styles.iconWrapper}>
                      <FaClock
                        className={`${styles.icon} ${
                          laterMovies.includes(movie.id.toString())
                            ? styles.activeIcon
                            : ""
                        }`}
                        onClick={() => toggleLaterMovie(movie)}
                      />
                      <span className={styles.tooltip}>
                        {getLaterTooltip(movie)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {movie.title} ({movie.release_date?.slice(0, 4)})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
