module.exports = {
  development: {
    client: "pg", // Używamy PostgreSQL
    connection: {
      host: "127.0.0.1",
      port: "5432",
      user: "postgres",
      password: "root",
      database: "discount_app",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  test: {
    client: "sqlite3", // Używamy SQLite dla testów
    connection: {
      filename: ":memory:", // Baza danych w pamięci
    },
    useNullAsDefault: true, // Wymagane dla SQLite
    migrations: {
      directory: "./migrations", // Używamy tych samych migracji
    },
    seeds: {
      directory: "./seeds", // Opcjonalnie, jeśli chcesz załadować dane testowe
    },
  },
};
