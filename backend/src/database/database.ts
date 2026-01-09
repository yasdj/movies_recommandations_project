import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp("postgres://postgres:postgresql@localhost:5432/postgres");

async function handleExtensions() {
    await db.none(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
}

async function createUsersTable() {
  await db.none(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
}

async function createMoviesTable() {
  await db.none(`
    CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY NOT NULL,
      poster_path TEXT NOT NULL,
      title TEXT NOT NULL,
      release_date TEXT NOT NULL
    );
  `);
}

async function createUserWatchedTable() {
  await db.none(`
    CREATE TABLE IF NOT EXISTS user_watched (
      user_id UUID NOT NULL,
      movie_id TEXT NOT NULL,
      PRIMARY KEY (user_id, movie_id)
    );
  `);
}

async function createUserLaterTable() {
  await db.none(`
    CREATE TABLE IF NOT EXISTS user_later (
      user_id UUID NOT NULL,
      movie_id TEXT NOT NULL,
      PRIMARY KEY (user_id, movie_id)
    );
  `);
}

export async function createTables() {
    await handleExtensions();
    await createUsersTable();
    await createUserWatchedTable();
    await createUserLaterTable();
    await createMoviesTable();
}

export default db;
