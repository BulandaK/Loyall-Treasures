const request = require("supertest");
const app = require("../app");
const Location = require("../models/locationModel");
const jwt = require("jsonwebtoken");
jest.mock("../models/locationModel");

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

describe("LocationController", () => {
  describe("getAllLocations", () => {
    it("should return all locations", async () => {
      const mockLocations = [
        { id: 1, name: "Location 1" },
        { id: 2, name: "Location 2" },
      ];
      Location.query.mockReturnValue({
        withGraphFetched: jest.fn().mockResolvedValue(mockLocations),
      });

      // Generujemy token JWT dla admina

      const response = await request(app)
        .get("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`); // Dodajemy token

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLocations);
      expect(Array.isArray(response.body)).toBe(true);
    });
    it("should return 401 if no token is provided for GET /locations", async () => {
      const response = await request(app).get("/api/locations");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should handle errors when fetching locations", async () => {
      Location.query.mockReturnValue({
        withGraphFetched: jest
          .fn()
          .mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .get("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error fetching locations"
      );
    });
  });

  describe("getLocationById", () => {
    it("should return a location by ID", async () => {
      const mockLocation = { id: 1, name: "Location 1" };
      Location.query.mockReturnValue({
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest.fn().mockResolvedValue(mockLocation),
        }),
      });

      const response = await request(app)
        .get("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLocation);
    });

    it("should return 404 if location is not found", async () => {
      Location.query.mockReturnValue({
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest.fn().mockResolvedValue(null),
        }),
      });

      const response = await request(app)
        .get("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Location not found");
    });

    it("should handle errors when fetching a location by ID", async () => {
      Location.query.mockReturnValue({
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest
            .fn()
            .mockRejectedValue(new Error("Database error")),
        }),
      });

      const response = await request(app)
        .get("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error fetching location"
      );
    });
  });

  describe("createLocation", () => {
    it("should create a new location", async () => {
      const newLocation = { name: "Test Location" };
      const mockInsertedLocation = { id: 1, name: "Test Location" };
      Location.query.mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockInsertedLocation),
      });

      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLocation);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInsertedLocation);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newLocation.name);
    });

    it("should handle errors when creating a location", async () => {
      Location.query.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .post("/api/locations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Location" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error creating location"
      );
    });
  });

  describe("updateLocation", () => {
    it("should update a location by ID", async () => {
      const updatedLocation = { id: 1, name: "Updated Location" };
      Location.query.mockReturnValue({
        patchAndFetchById: jest.fn().mockResolvedValue(updatedLocation),
      });

      const response = await request(app)
        .put("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Location" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedLocation);
    });

    it("should return 404 if location to update is not found", async () => {
      Location.query.mockReturnValue({
        patchAndFetchById: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app)
        .put("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Location" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Location not found");
    });

    it("should handle errors when updating a location", async () => {
      Location.query.mockReturnValue({
        patchAndFetchById: jest
          .fn()
          .mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .put("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Location" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error updating location"
      );
    });
  });

  describe("deleteLocation", () => {
    it("should delete a location by ID", async () => {
      Location.query.mockReturnValue({
        deleteById: jest.fn().mockResolvedValue(1),
      });

      const response = await request(app)
        .delete("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Location deleted successfully"
      );
    });

    it("should return 404 if location to delete is not found", async () => {
      Location.query.mockReturnValue({
        deleteById: jest.fn().mockResolvedValue(0),
      });

      const response = await request(app)
        .delete("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Location not found");
    });

    it("should handle errors when deleting a location", async () => {
      Location.query.mockReturnValue({
        deleteById: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .delete("/api/locations/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error deleting location"
      );
    });
  });
});
