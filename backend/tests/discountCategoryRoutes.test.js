const knex = require("../db"); // Import instancji Knex z db.js
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  await knex.migrate.latest(); // Uruchom migracje
});

afterAll(async () => {
  await knex.destroy(); // Zamknij połączenie z bazą danych
});

describe("Discount Category Routes", () => {
  it("GET /api/categories - powinno zwrócić wszystkie kategorie", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("POST /api/categories - powinno dodać nową kategorię", async () => {
    const newCategory = { name: "Test Category" };
    const response = await request(app)
      .post("/api/categories")
      .send(newCategory);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newCategory.name);
  });
});
