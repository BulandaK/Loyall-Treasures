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
  await knex("locations").truncate();
  await knex("cities").truncate();
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

describe("LocationController", () => {
  describe("getAllLocations", () => {
    it("should return all locations", async () => {
      // Dodaj miasto
      const city = await knex("cities")
        .insert({
          city_name: "Test City",
          postal_code: "12345",
          country: "Poland",
        })
        .returning("*");

      // Dodaj lokalizacje
      await knex("locations").insert([
        {
          name: "Location 1",
          address: "Address 1",
          city_id: city[0].city_id,
        },
        {
          name: "Location 2",
          address: "Address 2",
          city_id: city[0].city_id,
        },
      ]);

      const response = await request(app)
        .get("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Location 1" }),
          expect.objectContaining({ name: "Location 2" }),
        ])
      );
    });

    it("should return an empty array if no locations exist", async () => {
      const response = await request(app)
        .get("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("createLocation", () => {
    it("should create a new location", async () => {
      const newLocation = {
        name: "Test Location",
        address: "Test Address",
      };

      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLocation);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("location_id");
      expect(response.body.name).toBe(newLocation.name);
      expect(response.body.address).toBe(newLocation.address);

      const locationInDB = await knex("locations")
        .where({ location_id: response.body.location_id })
        .first();
      expect(locationInDB).toMatchObject(newLocation);
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ address: "Test Address" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Valid name is required");
    });

    it("should return 400 if address is missing", async () => {
      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Location" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Valid address is required"
      );
    });

    it("should return 400 if name is empty string", async () => {
      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "", address: "Test Address" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Valid name is required");
    });

    it("should return 400 if address is empty string", async () => {
      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Location", address: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Valid address is required"
      );
    });

    it("should return 409 if location with same name exists", async () => {
      // Najpierw tworzymy lokalizację
      await knex("locations").insert({
        name: "Existing Location",
        address: "Test Address",
      });

      // Próbujemy utworzyć lokalizację o tej samej nazwie
      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Existing Location", address: "Different Address" });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Location with this name already exists"
      );
    });

    it("should create location with optional fields", async () => {
      const newLocation = {
        name: "Test Location",
        address: "Test Address",
        phone: "123456789",
        email: "test@example.com",
        website: "https://example.com",
        is_active: true,
      };

      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLocation);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newLocation);
    });
  });
});
