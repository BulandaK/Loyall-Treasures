const Knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("./knexfile");

// Inicjalizacja Knex.js
const knex = Knex(knexConfig.development);

// Powiązanie Objection.js z Knex.js
Model.knex(knex);

module.exports = knex;
