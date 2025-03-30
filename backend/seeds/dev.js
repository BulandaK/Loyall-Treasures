/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Usunięcie wszystkich istniejących danych
  await knex("discount_ratings").del();
  await knex("user_favorites").del();
  await knex("discount_redemptions").del();
  await knex("discounts").del();
  await knex("discount_categories").del();
  await knex("locations").del();
  await knex("cities").del();
  await knex("users").del();
  await knex("user_roles").del();

  // Dodanie danych do tabeli user_roles
  await knex("user_roles").insert([
    {
      role_id: 1,
      role_name: "admin",
      description: "Administrator systemu z pełnymi uprawnieniami",
    },
    {
      role_id: 2,
      role_name: "user",
      description: "Zwykły użytkownik aplikacji",
    },
  ]);

  // Dodanie danych do tabeli users
  await knex("users").insert([
    {
      user_id: 1,
      username: "admin",
      email: "admin@example.com",
      password_hash: "hashedpassword1",
      first_name: "Admin",
      last_name: "User",
      role_id: 1,
      created_at: knex.fn.now(),
      last_login: null,
      is_active: true,
    },
    {
      user_id: 2,
      username: "testuser",
      email: "testuser@example.com",
      password_hash: "hashedpassword2",
      first_name: "Test",
      last_name: "User",
      role_id: 2,
      created_at: knex.fn.now(),
      last_login: null,
      is_active: true,
    },
  ]);

  // Dodanie danych do tabeli cities
  await knex("cities").insert([
    {
      city_id: 1,
      city_name: "Warszawa",
      postal_code: "00-001",
      country: "Polska",
      created_at: knex.fn.now(),
    },
    {
      city_id: 2,
      city_name: "Kraków",
      postal_code: "30-001",
      country: "Polska",
      created_at: knex.fn.now(),
    },
  ]);

  // Dodanie danych do tabeli locations
  await knex("locations").insert([
    {
      location_id: 1,
      city_id: 1,
      name: "Restauracja Warszawska",
      address: "ul. Marszałkowska 1",
      latitude: 52.2297,
      longitude: 21.0122,
      phone: "123456789",
      email: "warszawa@example.com",
      website: "https://warszawa.example.com",
      is_active: true,
      created_at: knex.fn.now(),
    },
    {
      location_id: 2,
      city_id: 2,
      name: "Kawiarnia Krakowska",
      address: "ul. Floriańska 2",
      latitude: 50.0614,
      longitude: 19.9366,
      phone: "987654321",
      email: "krakow@example.com",
      website: "https://krakow.example.com",
      is_active: true,
      created_at: knex.fn.now(),
    },
  ]);

  // Dodanie danych do tabeli discount_categories
  await knex("discount_categories").insert([
    {
      category_id: 1,
      name: "Jedzenie",
      description: "Zniżki na jedzenie",
      icon: "🍔",
    },
    {
      category_id: 2,
      name: "Elektronika",
      description: "Zniżki na elektronikę",
      icon: "💻",
    },
  ]);

  // Dodanie danych do tabeli discounts
  await knex("discounts").insert([
    {
      discount_id: 1,
      location_id: 1,
      category_id: 1,
      title: "20% zniżki na obiady",
      description: "Zniżka na wszystkie obiady w Restauracji Warszawskiej",
      normal_price: 50.0,
      discount_price: 40.0,
      percentage_discount: 20,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 1,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 2,
      location_id: 2,
      category_id: 2,
      title: "10% zniżki na laptopy",
      description: "Zniżka na wszystkie laptopy w Krakowie",
      normal_price: 3000.0,
      discount_price: 2700.0,
      percentage_discount: 10,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 2,
      last_updated: knex.fn.now(),
    },
  ]);

  // Dodanie danych do tabeli discount_redemptions
  await knex("discount_redemptions").insert([
    {
      redemption_id: 1,
      discount_id: 1,
      user_id: 2,
      redeemed_at: knex.fn.now(),
      location_id: 1,
      used_code: "DISCOUNT20",
      is_used: true,
    },
  ]);

  // Dodanie danych do tabeli user_favorites
  await knex("user_favorites").insert([
    { favorite_id: 1, user_id: 2, discount_id: 1, added_at: knex.fn.now() },
  ]);

  // Dodanie danych do tabeli discount_ratings
  await knex("discount_ratings").insert([
    {
      rating_id: 1,
      discount_id: 1,
      user_id: 2,
      rating: 5,
      comment: "Świetna zniżka!",
      created_at: knex.fn.now(),
    },
  ]);
};
