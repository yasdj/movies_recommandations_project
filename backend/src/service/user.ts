import db from "../database/database";
import { UserDto } from "../models/dto/user-dto";
import { User } from "../models/user";

type UserRow = {
  id: string;
  username: string;
  email: string;
  password: string;
};

function mapUserRow(row: UserRow | null): UserRow {
  if (!row) throw new Error("User not found");
  return row;
}

export async function getUser(id: string): Promise<UserRow> {
  const user = await db.oneOrNone<UserRow>(
    `SELECT id, name AS username, email, password
     FROM users
     WHERE id = $1`,
    [id]
  );
  return user || Promise.reject("User not found");
}

export async function createUser(user: UserDto): Promise<UserRow> {
  const created = await db.oneOrNone<UserRow>(
    `INSERT INTO users(name, email, password)
     VALUES($1, $2, $3)
     RETURNING id, name AS username, email, password`,
    [user.username, user.email, user.password]
  );

  return created || Promise.reject("User not created");
}

export async function connectUser(
  username: string,
  password: string
): Promise<UserRow> {
  const user = await db.oneOrNone<UserRow>(
    `SELECT id, name AS username, email, password
     FROM users
     WHERE name = $1`,
    [username]
  );

  if (!user) return Promise.reject("User doesn't exist");
  if (user.password !== password) return Promise.reject("Incorrect password");

  return user;
}

export async function addWatchedMovie(
  userId: string,
  movieId: string
): Promise<boolean> {
  const row = await db.oneOrNone(
    `INSERT INTO user_watched (user_id, movie_id)
     VALUES ($1, $2)
     RETURNING 1 AS inserted;`,
    [userId, movieId]
  );

  return !!row;
}

export async function removeWatchedMovie(
  userId: string,
  movieId: string
): Promise<boolean> {
  const row = await db.result(
    `DELETE FROM user_watched 
     WHERE user_id = $1 AND movie_id = $2`,
    [userId, movieId]
  );

  return row.rowCount > 0;
}

export async function getWatchedMovies(userId: string): Promise<string[]> {
  const movies = await db.manyOrNone<{ movie_id: string }>(
    `SELECT movie_id FROM user_watched WHERE user_id = $1`,
    [userId]
  );

  return movies.map((m) => m.movie_id);
}

export async function addLaterMovie(
  userId: string,
  movieId: string
): Promise<boolean> {
  const row = await db.oneOrNone(
    `INSERT INTO user_later (user_id, movie_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, movie_id)
     DO NOTHING
     RETURNING 1 AS inserted;`,
    [userId, movieId]
  );

  return !!row;
}

export async function removeLaterMovie(
  userId: string,
  movieId: string
): Promise<boolean> {
  const row = await db.result(
    `DELETE FROM user_later
     WHERE user_id = $1 AND movie_id = $2`,
    [userId, movieId]
  );

  return row.rowCount > 0;
}

export async function getLaterMovies(userId: string): Promise<string[]> {
  const movies = await db.manyOrNone<{ movie_id: string }>(
    `SELECT movie_id FROM user_later WHERE user_id = $1`,
    [userId]
  );

  return movies.map((m) => m.movie_id);
}

export async function updateUser(
  id: string,
  updates: Record<string, unknown>
): Promise<UserRow> {
  const keys = Object.keys(updates);
  const values = Object.values(updates);

  if (keys.length === 0) return Promise.reject("No updates");

  // Mapping: ton API parle de "username" mais la DB a "name"
  const mappedKeys = keys.map((k) => (k === "username" ? "name" : k));

  const setClause = mappedKeys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const result = await db.oneOrNone<UserRow>(
    `UPDATE users
     SET ${setClause}
     WHERE id = $${mappedKeys.length + 1}
     RETURNING id, name AS username, email, password`,
    [...values, id]
  );

  return result || Promise.reject("User not found");
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  return await db.oneOrNone<UserRow>(
    `SELECT id, name AS username, email, password
     FROM users
     WHERE email = $1`,
    [email]
  );
}
