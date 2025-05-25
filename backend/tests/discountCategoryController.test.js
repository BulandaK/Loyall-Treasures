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
  role_id: 1,
});

describe("DiscountCategoryController", () => {
  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      await knex("discount_categories").insert([
        { name: "Category 1", description: "Description 1" },
        { name: "Category 2", description: "Description 2" },
      ]);

      const response = await request(app).get("/api/categories");

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
      const response = await request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`);

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

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("category_id");
      expect(response.body.name).toBe(newCategory.name);

      const categoryInDB = await knex("discount_categories")
        .where({ category_id: response.body.category_id })
        .first();
      expect(categoryInDB).toMatchObject(newCategory);
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Valid name is required");
    });

    it("should return 400 if name is empty string", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Valid name is required");
    });

    it("should return 400 if name is only whitespace", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "   " });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Valid name is required");
    });

    it("should return 409 if category with same name exists", async () => {
      await knex("discount_categories").insert({
        name: "Existing Category",
        description: "Test Description",
      });

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Existing Category" });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Category with this name already exists"
      );
    });

    it("should create category with optional fields", async () => {
      const newCategory = {
        name: "Test Category",
        description: "Test Description",
        icon: "test-icon",
      };

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newCategory);
    });
  });
});
