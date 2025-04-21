const request = require("supertest");
const app = require("../app");
const UserFavorite = require("../models/userFavoriteModel");
const jwt = require("jsonwebtoken");

jest.mock("../models/userFavoriteModel");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

describe("UserFavoriteController", () => {
  describe("getFavoritesByUser", () => {
    it("should return all favorites for a user", async () => {
      const mockFavorites = [
        { id: 1, user_id: 1, discount_id: 1, discount: { name: "Discount 1" } },
        { id: 2, user_id: 1, discount_id: 2, discount: { name: "Discount 2" } },
      ];
      UserFavorite.query.mockReturnValue({
        where: jest.fn().mockReturnValue({
          withGraphFetched: jest.fn().mockResolvedValue(mockFavorites),
        }),
      });

      // Generujemy token JWT dla użytkownika
      const userToken = generateToken({
        id: 1,
        email: "user@example.com",
        role_id: 2, // Rola użytkownika
      });

      const response = await request(app)
        .get("/api/favorites/users/1")
        .set("Authorization", `Bearer ${userToken}`); // Dodajemy token;

      expect(response.status).toBe(200);

      expect(response.body).toEqual(mockFavorites);
      expect(Array.isArray(response.body)).toBe(true);
    });
    it("should return 401 if no token is provided for GET /favorites/users/:userId", async () => {
      const response = await request(app).get("/api/favorites/users/1");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should handle errors when fetching favorites", async () => {
      UserFavorite.query.mockReturnValue({
        where: jest.fn().mockReturnValue({
          withGraphFetched: jest
            .fn()
            .mockRejectedValue(new Error("Database error")),
        }),
      });

      // Generujemy token JWT dla użytkownika
      const userToken = generateToken({
        id: 1,
        email: "user@example.com",
        role_id: 2,
      });

      const response = await request(app)
        .get("/api/favorites/users/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error fetching favorites"
      );
    });
  });

  describe("addFavorite", () => {
    it("should add a new favorite", async () => {
      const newFavorite = { user_id: 1, discount_id: 1 };
      const mockInsertedFavorite = { id: 1, ...newFavorite };
      UserFavorite.query.mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockInsertedFavorite),
      });

      // Generujemy token JWT dla użytkownika
      const userToken = generateToken({
        id: 1,
        email: "user@example.com",
        role_id: 2,
      });

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`) // Dodajemy token
        .send(newFavorite);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInsertedFavorite);
      expect(response.body).toHaveProperty("id");
      expect(response.body.user_id).toBe(newFavorite.user_id);
      expect(response.body.discount_id).toBe(newFavorite.discount_id);
    });
    it("should return 401 if no token is provided for POST /favorites", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .send({ user_id: 1, discount_id: 1 });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should handle errors when adding a favorite", async () => {
      UserFavorite.query.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      // Generujemy token JWT dla użytkownika
      const userToken = generateToken({
        id: 1,
        email: "user@example.com",
        role_id: 2,
      });

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ user_id: 1, discount_id: 1 });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error adding favorite");
    });
  });

  describe("removeFavorite", () => {
    it("should remove a favorite", async () => {
      UserFavorite.query.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockResolvedValue(1),
          }),
        }),
      });

      // Generujemy token JWT dla użytkownika
      const userToken = generateToken({
        id: 1,
        email: "user@example.com",
        role_id: 2,
      });

      const response = await request(app)
        .delete("/api/favorites/users/1/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Favorite removed successfully"
      );
    });

    it("should return 401 if no token is provided for DELETE /favorites/users/:userId/:discountId", async () => {
      const response = await request(app).delete("/api/favorites/users/1/1");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should handle errors when removing a favorite", async () => {
      UserFavorite.query.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      });

      // Generujemy token JWT dla użytkownika
      const userToken = generateToken({
        id: 1,
        email: "user@example.com",
        role_id: 2,
      });

      const response = await request(app)
        .delete("/api/favorites/users/1/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error removing favorite"
      );
    });
  });
});
