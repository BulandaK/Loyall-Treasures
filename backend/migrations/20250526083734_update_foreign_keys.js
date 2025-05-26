/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Usuń istniejące ograniczenia kluczy obcych
  await knex.schema.alterTable("discount_redemptions", (table) => {
    table.dropForeign(["user_id"]);
  });

  // Dodaj nowe ograniczenia z CASCADE
  await knex.schema.alterTable("discount_redemptions", (table) => {
    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Przywróć poprzednie ograniczenia
  await knex.schema.alterTable("discount_redemptions", (table) => {
    table.dropForeign(["user_id"]);
  });

  await knex.schema.alterTable("discount_redemptions", (table) => {
    table.foreign("user_id").references("user_id").inTable("users");
  });
};
