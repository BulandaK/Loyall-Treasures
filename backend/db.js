const Knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("./knexfile");

// Inicjalizacja Knex.js

// console.log("Knex instance initialized:", knex);

// Powiązanie Objection.js z Knex.js

function setupDB() {
  const knex = Knex(knexConfig.development);
  Model.knex(knex);
}

module.exports = setupDB;
