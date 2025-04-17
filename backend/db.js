const Knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("./knexfile");

function setupDB() {
  const environment = process.env.NODE_ENV || "development"; // Domyślnie 'development'
  const knex = Knex(knexConfig[environment]);
  Model.knex(knex);
  return knex; // Zwracamy instancję knex
}

module.exports = setupDB;
