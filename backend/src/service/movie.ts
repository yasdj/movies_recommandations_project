import db from "../database/database";
import { Movie } from "../models/movie";

export async function getWatchedMovies(userId: string): Promise<Movie[]> {
   const movies = await db.manyOrNone(
    `SELECT m.id, m.title, m.release_date, m.poster_path 
    FROM user_watched uw 
    JOIN movies m ON uw.movie_id = m.id 
    JOIN users u ON uw.user_id = u.id 
    WHERE uw.user_id = $1;`,
    [userId]
  );

  return movies;
}

export async function getLaterMovies(userId: string): Promise<Movie[]> {
   const movies = await db.manyOrNone(
    `SELECT m.id, m.title, m.release_date, m.poster_path 
    FROM user_later ul
    JOIN movies m ON ul.movie_id = m.id 
    JOIN users u ON ul.user_id = u.id 
    WHERE ul.user_id = $1;`,
    [userId]
  );

  return movies;
}

export async function addMovie(movieId: string, title: string, releaseDate: string, posterPath: string): Promise<boolean> {
   const movie = await db.oneOrNone(
    `INSERT INTO movies (id, title, release_date, poster_path)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING;`,
    [movieId, title, releaseDate, posterPath]
  );

  return !!movie;
}