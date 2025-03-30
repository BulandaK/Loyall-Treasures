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
};
