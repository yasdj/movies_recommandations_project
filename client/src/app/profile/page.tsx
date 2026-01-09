/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "../../styles/profile.module.css";
import { useState, useEffect, useCallback } from "react";
import { get } from "../api/api";
//import { useRouter } from "next/navigation";

interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

export default function Profile() {
  //const router = useRouter();

  const [watchedMovies, setWatchedMovies] = useState<TmdbMovie[]>([]);
  const [laterMovies, setLaterMovies] = useState<TmdbMovie[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // localStorage seulement côté client
    const u = localStorage.getItem("username");
    const id = localStorage.getItem("id");
    setUsername(u);
    setUserId(id);
  }, []);

  const getWatchedMovies = useCallback(async () => {
    if (!userId) return;
    try {
      const movies = await get<TmdbMovie[]>(`/api/user/${userId}/watched`);
      console.log(movies);
      setWatchedMovies(movies ?? []);
    } catch (err) {
      console.error("Failed to get watched movies:", err);
      // si pas authentifié (cookie absent/expiré), tu peux rediriger :
      // router.push("/login");
    }
  }, [userId]);

  const getLaterMovies = useCallback(async () => {
    if (!userId) return;
    try {
      const movies = await get<TmdbMovie[]>(`/api/user/${userId}/later`);
      setLaterMovies(movies ?? []);
    } catch (err) {
      console.error("Failed to get later movies:", err);
      // router.push("/login");
    }
  }, [userId]);

  useEffect(() => {
    getWatchedMovies();
    getLaterMovies();
  }, [getWatchedMovies, getLaterMovies]);

  return (
    <div className={styles.container}>
      <div className={styles.navigationContainer}>My profile</div>
      <div className={styles.banner}></div>
      <div className={styles.pageContainer}>
        <div className={styles.profileInfo}>
          <div className={styles.profileDetails}>
            <div className={styles.picture}>
              <img src="/pp.jpg" alt="Profile" />
            </div>
            <div className={styles.description}>
              <div className={styles.username}>@{username}</div>
              <div className={styles.bio}>Pro Watcher</div>
            </div>
          </div>
          <div className={styles.editProfile}>
            <button>Edit Profile</button>
          </div>
        </div>

        {/* LATER MOVIES */}
        <div className={styles.laterContainer}>
          <div className={styles.header}>
            <span className={styles.title}>Watch Later</span>
          </div>
          <div className={styles.laterMoviesWrapper}>
            <div className={styles.moviesList}>
              {laterMovies.map((movie) => (
                <div key={movie.id} className={styles.movies}>
                  {movie.poster_path && (
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "/noPhoto.jpg"
                      }
                      alt={movie.title}
                      className={styles.poster}
                    />
                  )}
                  <div className={styles.movieTitle}>
                    {movie.title} ({movie.release_date?.slice(0, 4)})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WATCHED MOVIES */}
        <div className={styles.watchedContainer}>
          <div className={styles.header}>
            <span className={styles.title}>Watched Movies</span>
          </div>
          <div className={styles.watchedMoviesWrapper}>
            <div className={styles.moviesList}>
              {watchedMovies.map((movie) => (
                <div key={movie.id} className={styles.movies}>
                  {movie.poster_path && (
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "/noPhoto.jpg"
                      }
                      alt={movie.title}
                      className={styles.poster}
                    />
                  )}
                  <div className={styles.movieTitle}>
                    {movie.title} ({movie.release_date?.slice(0, 4)})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
