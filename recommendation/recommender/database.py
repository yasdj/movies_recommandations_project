from psycopg_pool import ConnectionPool

CONN_STR = "postgres://postgres:postgresql@localhost:5432/postgres"

pool = ConnectionPool(CONN_STR, min_size=1, max_size=10)
