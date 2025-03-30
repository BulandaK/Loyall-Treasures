const Knex = require("knex");
const knexConfig = require("./knexfile");

const knex = Knex(knexConfig.development);

async function testConnection() {
  try {
    await knex.raw("SELECT 1+1 AS result");
    console.log("Database connection is working!");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    knex.destroy(); // Zamknij połączenie
  }
}

testConnection();
