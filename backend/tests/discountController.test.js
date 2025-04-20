const request = require("supertest");
const app = require("../app");
const setupDB = require("../db");

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
  await knex.raw("DELETE FROM discounts");
  await knex.raw("DELETE FROM sqlite_sequence WHERE name = 'discounts'");
});

describe("DiscountController (Integration Tests)", () => {
  describe("GET /api/discounts", () => {
    it("should return all discounts with status 200", async () => {
      // Wstaw dane testowe
      await knex("discounts").insert([
        { discount_id: 1, title: "Discount 1", description: "Description 1" },
        { discount_id: 2, title: "Discount 2", description: "Description 2" },
      ]);

      // Wykonaj żądanie HTTP
      const response = await request(app).get("/api/discounts");

      // Sprawdź odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Discount 1",
            description: "Description 1",
          }),
          expect.objectContaining({
            title: "Discount 2",
            description: "Description 2",
          }),
        ])
      );
    });

    it("should return an empty array if no discounts exist", async () => {
      // Wykonaj żądanie HTTP bez danych w bazie
      const response = await request(app).get("/api/discounts");

      // Sprawdź odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/discounts/:id", () => {
    it("should return a discount by ID with status 200", async () => {
      // Wstaw dane testowe
      await knex("discounts").insert({
        title: "Discount 1",
        description: "Description 1",
      });

      // Wykonaj żądanie HTTP
      const response = await request(app).get("/api/discounts/1");

      // Sprawdź odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: "Discount 1",
          description: "Description 1",
        })
      );
    });

    it("should return 404 if discount is not found", async () => {
      // Wykonaj żądanie HTTP dla nieistniejącego ID
      const response = await request(app).get("/api/discounts/999");

      // Sprawdź odpowiedź
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Discount not found");
    });
  });

  describe("POST /api/discounts", () => {
    it("should create a new discount and return it with status 201", async () => {
      const newDiscount = {
        title: "New Discount",
        description: "New Description",
      };

      // Wykonaj żądanie HTTP
      const response = await request(app)
        .post("/api/discounts")
        .send(newDiscount);

      // Sprawdź odpowiedź
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("discount_id");
      expect(response.body).toHaveProperty("title", "New Discount");
      expect(response.body).toHaveProperty("description", "New Description");

      // Sprawdź, czy dane zostały zapisane w bazie
      const discountInDB = await knex("discounts")
        .where({ discount_id: response.body.discount_id })
        .first();
      expect(discountInDB).toMatchObject(newDiscount);
    });

    it("should handle errors and return status 500", async () => {
      // Przykład błędu, np. brak wymaganych danych
      const response = await request(app).post("/api/discounts").send({});

      // Sprawdź odpowiedź
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error creating discount"
      );
    });
  });

  describe("PUT /api/discounts/:id", () => {
    it("should update a discount and return it with status 200", async () => {
      // Wstaw dane testowe
      await knex("discounts").insert({
        title: "Old Discount",
        description: "Old Description",
      });

      const updatedDiscount = {
        title: "Updated Discount",
        description: "Updated Description",
      };

      // Wykonaj żądanie HTTP
      const response = await request(app)
        .put("/api/discounts/1")
        .send(updatedDiscount);

      // Sprawdź odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", "Updated Discount");
      expect(response.body).toHaveProperty(
        "description",
        "Updated Description"
      );

      // Sprawdź, czy dane zostały zaktualizowane w bazie
      const discountInDB = await knex("discounts")
        .where({ discount_id: 1 })
        .first();
      expect(discountInDB).toMatchObject(updatedDiscount);
    });

    it("should return 404 if discount to update is not found", async () => {
      const response = await request(app)
        .put("/api/discounts/999")
        .send({ title: "Updated Discount" });

      // Sprawdź odpowiedź
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Discount not found");
    });
  });

  describe("DELETE /api/discounts/:id", () => {
    it("should delete a discount and return status 200", async () => {
      // Wstaw dane testowe
      await knex("discounts").insert({
        title: "Discount to delete",
      });

      // Wykonaj żądanie HTTP
      const response = await request(app).delete("/api/discounts/1");

      // Sprawdź odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Discount deleted successfully"
      );

      // Sprawdź, czy dane zostały usunięte z bazy
      const discountInDB = await knex("discounts")
        .where({ discount_id: 1 })
        .first();
      expect(discountInDB).toBeUndefined();
    });

    it("should return 404 if discount to delete is not found", async () => {
      const response = await request(app).delete("/api/discounts/999");

      // Sprawdź odpowiedź
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Discount not found");
    });
  });
});
