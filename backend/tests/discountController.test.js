const request = require("supertest");
const app = require("../app");
const setupDB = require("../db");
const jwt = require("jsonwebtoken");

let knex;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  knex = setupDB();
  await knex.migrate.latest();
  await knex.raw("PRAGMA foreign_keys = ON");
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  await knex.raw("DELETE FROM discounts");
  await knex.raw("DELETE FROM sqlite_sequence WHERE name = 'discounts'");
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
  role_id: 1,
});

describe("DiscountController (Integration Tests)", () => {
  describe("GET /api/discounts", () => {
    it("should return all discounts with status 200", async () => {
      await knex("discounts").insert([
        { discount_id: 1, title: "Discount 1", description: "Description 1" },
        { discount_id: 2, title: "Discount 2", description: "Description 2" },
      ]);

      const response = await request(app).get("/api/discounts");

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
      const response = await request(app).get("/api/discounts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/discounts/:id", () => {
    it("should return a discount by ID with status 200", async () => {
      await knex("discounts").insert({
        title: "Discount 1",
        description: "Description 1",
      });

      const response = await request(app).get("/api/discounts/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: "Discount 1",
          description: "Description 1",
        })
      );
    });

    it("should return 404 if discount is not found", async () => {
      const response = await request(app).get("/api/discounts/999");

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

      const response = await request(app)
        .post("/api/discounts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newDiscount);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("discount_id");
      expect(response.body).toHaveProperty("title", "New Discount");
      expect(response.body).toHaveProperty("description", "New Description");

      const discountInDB = await knex("discounts")
        .where({ discount_id: response.body.discount_id })
        .first();
      expect(discountInDB).toMatchObject(newDiscount);
    });

    it("should handle errors and return status 500", async () => {
      const response = await request(app)
        .post("/api/discounts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error creating discount"
      );
    });
  });

  describe("PUT /api/discounts/:id", () => {
    it("should update a discount and return it with status 200", async () => {
      await knex("discounts").insert({
        title: "Old Discount",
        description: "Old Description",
      });

      const updatedDiscount = {
        title: "Updated Discount",
        description: "Updated Description",
      };

      const response = await request(app)
        .put("/api/discounts/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedDiscount);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", "Updated Discount");
      expect(response.body).toHaveProperty(
        "description",
        "Updated Description"
      );

      const discountInDB = await knex("discounts")
        .where({ discount_id: 1 })
        .first();
      expect(discountInDB).toMatchObject(updatedDiscount);
    });

    it("should return 404 if discount to update is not found", async () => {
      const response = await request(app)
        .put("/api/discounts/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Discount" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Discount not found");
    });
  });

  describe("DELETE /api/discounts/:id", () => {
    it("should delete a discount and return status 200", async () => {
      await knex("discounts").insert({
        title: "Discount to delete",
      });

      const response = await request(app)
        .delete("/api/discounts/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Discount deleted successfully"
      );

      const discountInDB = await knex("discounts")
        .where({ discount_id: 1 })
        .first();
      expect(discountInDB).toBeUndefined();
    });

    it("should return 404 if discount to delete is not found", async () => {
      const response = await request(app)
        .delete("/api/discounts/999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Discount not found");
    });
  });
});
