const bcrypt = require("bcrypt");

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

  // Hashowanie haseł
  const hashedPassword1 = await bcrypt.hash("admin", 10);
  const hashedPassword2 = await bcrypt.hash("test", 10);

  // Dodanie danych do tabeli users
  await knex("users").insert([
    {
      user_id: 1,
      username: "admin",
      email: "admin@example.com",
      password_hash: hashedPassword1,
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
      password_hash: hashedPassword2,
      first_name: "Test",
      last_name: "User",
      role_id: 2,
      created_at: knex.fn.now(),
      last_login: null,
      is_active: true,
    },
    {
      user_id: 3,
      username: "jan123",
      email: "jan@example.com",
      password_hash: hashedPassword2,
      first_name: "Jan",
      last_name: "Kowalski",
      role_id: 2,
      created_at: knex.fn.now(),
      last_login: null,
      is_active: true,
    },
    {
      user_id: 4,
      username: "anna.nowak",
      email: "anna@example.com",
      password_hash: hashedPassword2,
      first_name: "Anna",
      last_name: "Nowak",
      role_id: 2,
      created_at: knex.fn.now(),
      last_login: null,
      is_active: true,
    },
    {
      user_id: 5,
      username: "piotrek88",
      email: "piotr@example.com",
      password_hash: hashedPassword2,
      first_name: "Piotr",
      last_name: "Wiśniewski",
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
    {
      city_id: 3,
      city_name: "Wrocław",
      postal_code: "50-001",
      country: "Polska",
      created_at: knex.fn.now(),
    },
    {
      city_id: 4,
      city_name: "Gdańsk",
      postal_code: "80-001",
      country: "Polska",
      created_at: knex.fn.now(),
    },
    {
      city_id: 5,
      city_name: "Poznań",
      postal_code: "60-001",
      country: "Polska",
      created_at: knex.fn.now(),
    },
    {
      city_id: 6,
      city_name: "Łódź",
      postal_code: "90-001",
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
    {
      location_id: 3,
      city_id: 3,
      name: "Kawiarnia Wrocławska",
      address: "ul. Słoneczna 3",
      latitude: 51.1079,
      longitude: 17.0386,
      phone: "123456789",
      email: "wroclaw@example.com",
      website: "https://wroclaw.example.com",
      is_active: true,
      created_at: knex.fn.now(),
    },
    {
      location_id: 4,
      city_id: 4,
      name: "Kawiarnia Gdańska",
      address: "ul. Długa 4",
      latitude: 54.3469,
      longitude: 18.6435,
      phone: "123456789",
      email: "gdansk@example.com",
      website: "https://gdansk.example.com",
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
    {
      category_id: 3,
      name: "Rozrywka",
      description: "Zniżki na rozrywkę",
      icon: "🎉",
    },
    {
      category_id: 4,
      name: "Moda",
      description: "Zniżki na modę",
      icon: "👗",
    },
    {
      category_id: 5,
      name: "Sport",
      description: "Zniżki na sport",
      icon: "🏃",
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
    {
      discount_id: 3,
      location_id: 3,
      category_id: 3,
      title: "15% zniżki na bilety",
      description: "Zniżka na bilety do kina w Kawiarni Wrocławskiej",
      normal_price: 40.0,
      discount_price: 34.0,
      percentage_discount: 15,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 3,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 4,
      location_id: 4,
      category_id: 4,
      title: "30% zniżki na odzież",
      description: "Zniżka na wszystkie ubrania w Kawiarni Gdańskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 5,
      location_id: 1,
      category_id: 2,
      title: "30% zniżki na laptopy",
      description: "Zniżka na wszystkie laptopy w Restauracji Warszawskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 6,
      location_id: 2,
      category_id: 5,
      title: "30% zniżki na sport",
      description: "Zniżka na wszystkie sporty w Kawiarni Krakowskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 7,
      location_id: 3,
      category_id: 3,
      title: "30% zniżki na bilety",
      description: "Zniżka na bilety do kina w Kawiarni Wrocławskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
      last_updated: knex.fn.now(),
    },

    {
      discount_id: 8,
      location_id: 4,
      category_id: 1,
      title: "30% zniżki na obiady",
      description: "Zniżka na wszystkie obiady w Kawiarni Gdańskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 9,
      location_id: 1,
      category_id: 1,
      title: "30% zniżki na obiady",
      description: "Zniżka na wszystkie obiady w Restauracji Warszawskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
      last_updated: knex.fn.now(),
    },
    {
      discount_id: 10,
      location_id: 4,
      category_id: 2,
      title: "30% zniżki na laptopy",
      description: "Zniżka na wszystkie laptopy w galeri Gdańskiej",
      normal_price: 100.0,
      discount_price: 70.0,
      percentage_discount: 30,
      start_date: knex.fn.now(),
      end_date: knex.fn.now(),
      is_active: true,
      created_at: knex.fn.now(),
      created_by: 4,
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
    {
      redemption_id: 2,
      discount_id: 2,
      user_id: 3,
      redeemed_at: knex.fn.now(),
      location_id: 2,
      used_code: "LAPTOP10",
      is_used: true,
    },
    {
      redemption_id: 3,
      discount_id: 3,
      user_id: 4,
      redeemed_at: knex.fn.now(),
      location_id: 3,
      used_code: "MOVIE15",
      is_used: true,
    },
    {
      redemption_id: 4,
      discount_id: 4,
      user_id: 5,
      redeemed_at: knex.fn.now(),
      location_id: 4,
      used_code: "CLOTHES25",
      is_used: false,
    },
  ]);

  // Dodanie danych do tabeli user_favorites
  await knex("user_favorites").insert([
    { favorite_id: 2, user_id: 2, discount_id: 2, added_at: knex.fn.now() },
    { favorite_id: 3, user_id: 3, discount_id: 3, added_at: knex.fn.now() },
    { favorite_id: 4, user_id: 3, discount_id: 4, added_at: knex.fn.now() },
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
