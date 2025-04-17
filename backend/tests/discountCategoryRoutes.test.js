const request = require("supertest");
const app = require("../app");
const setupDB = require("../db");
const DiscountCategory = require("../models/discountCategoryModel");

jest.mock("../models/discountCategoryModel");

let knex;

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Ustawiamy środowisko na 'test'
  knex = setupDB(); // Inicjalizujemy bazę danych dla testów
  await knex.migrate.latest(); // Uruchamiamy migracje
});

afterAll(async () => {
  await knex.destroy(); // Zamykamy połączenie z bazą danych
});

describe("DiscountCategoryController", () => {
  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
      ];
      DiscountCategory.query.mockResolvedValue(mockCategories);

      const response = await request(app).get("/api/categories");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should handle errors when fetching categories", async () => {
      DiscountCategory.query.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/categories");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error fetching categories"
      );
    });
  });

  describe("createCategory", () => {
    it("should create a new category", async () => {
      const newCategory = { name: "Test Category" };
      const mockInsertedCategory = { id: 1, name: "Test Category" };
      DiscountCategory.query.mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockInsertedCategory),
      });

      const response = await request(app)
        .post("/api/categories")
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInsertedCategory);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newCategory.name);
    });

    it("should handle errors when creating a category", async () => {
      DiscountCategory.query.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .post("/api/categories")
        .send({ name: "Test Category" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error creating category"
      );
    });
  });
});
