const request = require("supertest");
const app = require("../app");
const setupDB = require("../db");
const jwt = require("jsonwebtoken");

let knex;

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Ustawiamy środowisko na 'test'
  knex = setupDB(); // Inicjalizujemy połączenie z bazą danych testową
  await knex.migrate.latest(); // Uruchamiamy migracje
  await knex.raw("PRAGMA foreign_keys = ON"); // Włączamy klucze obce dla SQLite3
});

afterAll(async () => {
  await knex.destroy(); // Zamykamy połączenie z bazą danych
});

beforeEach(async () => {
  // Czyszczenie tabeli przed każdym testem
  await knex("discount_categories").truncate();
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
const adminToken = generateToken({
  id: 1,
  email: "admin@example.com",
  role_id: 1, // Rola admina
});

describe("DiscountCategoryController", () => {
  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      // Wstawiamy dane testowe do bazy
      await knex("discount_categories").insert([
        { name: "Category 1", description: "Description 1" },
        { name: "Category 2", description: "Description 2" },
      ]);

      // Wykonujemy żądanie HTTP
      const response = await request(app).get("/api/categories");

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Category 1" }),
          expect.objectContaining({ name: "Category 2" }),
        ])
      );
    });

    it("should return an empty array if no categories exist", async () => {
      // Wykonujemy żądanie HTTP bez danych w bazie
      const response = await request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`);

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("createCategory", () => {
    it("should create a new category", async () => {
      const newCategory = {
        name: "Test Category",
        description: "Test Description",
      };

      // Wykonujemy żądanie HTTP
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCategory);

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("category_id");
      expect(response.body.name).toBe(newCategory.name);

      // Sprawdzamy, czy dane zostały zapisane w bazie
      const categoryInDB = await knex("discount_categories")
        .where({ category_id: response.body.category_id }) // Poprawione
        .first();
      expect(categoryInDB).toMatchObject(newCategory);
    });

    it("should return 400 if required fields are missing", async () => {
      // Wykonujemy żądanie HTTP bez wymaganych pól
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Name is required");
    });
  });
});
