const request = require("supertest");
const app = require("../app");
const UserFavorite = require("../models/userFavoriteModel");

jest.mock("../models/userFavoriteModel");

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

      const response = await request(app).get("/api/favorites/users/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFavorites);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should handle errors when fetching favorites", async () => {
      UserFavorite.query.mockReturnValue({
        where: jest.fn().mockReturnValue({
          withGraphFetched: jest
            .fn()
            .mockRejectedValue(new Error("Database error")),
        }),
      });

      const response = await request(app).get("/api/favorites/users/1");

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

      const response = await request(app)
        .post("/api/favorites")
        .send(newFavorite);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInsertedFavorite);
      expect(response.body).toHaveProperty("id");
      expect(response.body.user_id).toBe(newFavorite.user_id);
      expect(response.body.discount_id).toBe(newFavorite.discount_id);
    });

    it("should handle errors when adding a favorite", async () => {
      UserFavorite.query.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .post("/api/favorites")
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

      const response = await request(app).delete("/api/favorites/users/1/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Favorite removed successfully"
      );
    });

    it("should return 404 if favorite is not found", async () => {
      UserFavorite.query.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockResolvedValue(0),
          }),
        }),
      });

      const response = await request(app).delete("/api/favorites/users/1/1");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Favorite not found");
    });

    it("should handle errors when removing a favorite", async () => {
      UserFavorite.query.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      });

      const response = await request(app).delete("/api/favorites/users/1/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error removing favorite"
      );
    });
  });
});
