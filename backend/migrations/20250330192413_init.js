/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Tworzenie tabeli dla ról użytkowników
  await knex.schema.createTable("user_roles", (table) => {
    table.increments("role_id").primary();
    table.string("role_name", 50).notNullable().unique();
    table.text("description");
  });

  // Tworzenie tabeli użytkowników
  await knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("first_name", 50);
    table.string("last_name", 50);
    table
      .integer("role_id")
      .unsigned()
      .references("role_id")
      .inTable("user_roles")
      .onDelete("SET NULL")
      .defaultTo(2);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("last_login");
    table.boolean("is_active").defaultTo(true);
  });

  // Tworzenie tabeli miast
  await knex.schema.createTable("cities", (table) => {
    table.increments("city_id").primary();
    table.string("city_name", 100).notNullable();
    table.string("postal_code", 20);
    table.string("country", 100).defaultTo("Polska");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Tworzenie tabeli lokalizacji
  await knex.schema.createTable("locations", (table) => {
    table.increments("location_id").primary();
    table
      .integer("city_id")
      .unsigned()
      .references("city_id")
      .inTable("cities")
      .onDelete("CASCADE");
    table.string("name", 100).notNullable();
    table.text("address").notNullable();
    table.decimal("latitude", 10, 8);
    table.decimal("longitude", 11, 8);
    table.string("phone", 20);
    table.string("email", 100);
    table.string("website", 255);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Tworzenie tabeli kategorii zniżek
  await knex.schema.createTable("discount_categories", (table) => {
    table.increments("category_id").primary();
    table.string("name", 100).notNullable();
    table.text("description");
    table.string("icon", 50);
  });

  // Tworzenie tabeli zniżek
  await knex.schema.createTable("discounts", (table) => {
    table.increments("discount_id").primary();
    table
      .integer("location_id")
      .unsigned()
      .references("location_id")
      .inTable("locations")
      .onDelete("CASCADE");
    table
      .integer("category_id")
      .unsigned()
      .references("category_id")
      .inTable("discount_categories")
      .onDelete("SET NULL");
    table.string("title", 100).notNullable();
    table.text("description");
    table.decimal("normal_price", 10, 2);
    table.decimal("discount_price", 10, 2);
    table.integer("percentage_discount");
    table.timestamp("start_date");
    table.timestamp("end_date");
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .integer("created_by")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("SET NULL");
    table.timestamp("last_updated").defaultTo(knex.fn.now());
  });

  // Tworzenie tabeli historii odebranych zniżek
  await knex.schema.createTable("discount_redemptions", (table) => {
    table.increments("redemption_id").primary();
    table
      .integer("discount_id")
      .unsigned()
      .references("discount_id")
      .inTable("discounts")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("redeemed_at").defaultTo(knex.fn.now());
    table
      .integer("location_id")
      .unsigned()
      .references("location_id")
      .inTable("locations")
      .onDelete("CASCADE");
    table.string("used_code", 50);
    table.boolean("is_used").defaultTo(false);
  });

  // Tworzenie tabeli ulubionych zniżek użytkowników
  await knex.schema.createTable("user_favorites", (table) => {
    table.increments("favorite_id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("discount_id")
      .unsigned()
      .references("discount_id")
      .inTable("discounts")
      .onDelete("CASCADE");
    table.timestamp("added_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "discount_id"]);
  });

  // Tworzenie tabeli ocen zniżek
  await knex.schema.createTable("discount_ratings", (table) => {
    table.increments("rating_id").primary();
    table
      .integer("discount_id")
      .unsigned()
      .references("discount_id")
      .inTable("discounts")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table.smallint("rating").notNullable().checkBetween([1, 5]);
    table.text("comment");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "discount_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("discount_ratings");
  await knex.schema.dropTableIfExists("user_favorites");
  await knex.schema.dropTableIfExists("discount_redemptions");
  await knex.schema.dropTableIfExists("discounts");
  await knex.schema.dropTableIfExists("discount_categories");
  await knex.schema.dropTableIfExists("locations");
  await knex.schema.dropTableIfExists("cities");
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("user_roles");
};
