const request = require("supertest");
const app = require("../app"); // Upewnij się, że to jest poprawna ścieżka do Twojej aplikacji Express
const UserFavoriteService = require("../services/userFavoriteService"); // Importujemy serwis
const jwt = require("jsonwebtoken");

// Mockowanie serwisu zamiast modelu/DAO bezpośrednio
jest.mock("../services/userFavoriteService");

// Funkcja do generowania tokenu (bez zmian)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    process.env.JWT_SECRET || "test_secret", // Użyj testowego sekretu, jeśli JWT_SECRET nie jest ustawiony
    { expiresIn: "1h" }
  );
};

describe("UserFavoriteController", () => {
  const mockUser = { id: 1, email: "user@example.com", role_id: 2 };
  const userToken = generateToken(mockUser);

  beforeEach(() => {
    // Resetuj wszystkie mocki przed każdym testem
    jest.clearAllMocks();
  });

  describe("getFavoritesByUser", () => {
    it("should return all favorites for a user", async () => {
      const mockFavoritesData = [
        {
          favorite_id: 1,
          user_id: 1,
          discount_id: 101,
          added_at: new Date().toISOString(),
          discount: { discount_id: 101, title: "Discount A" },
        },
        {
          favorite_id: 2,
          user_id: 1,
          discount_id: 102,
          added_at: new Date().toISOString(),
          discount: { discount_id: 102, title: "Discount B" },
        },
      ];
      // Mockowanie metody serwisu
      UserFavoriteService.getFavoritesByUserId.mockResolvedValue(
        mockFavoritesData
      );

      const response = await request(app)
        .get("/api/favorites/users/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFavoritesData);
      expect(UserFavoriteService.getFavoritesByUserId).toHaveBeenCalledWith(
        "1"
      );
    });

    it("should return 401 if no token is provided for GET /favorites/users/:userId", async () => {
      const response = await request(app).get("/api/favorites/users/1");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 403 if user tries to access favorites of another user (and is not admin)", async () => {
      const otherUserToken = generateToken({
        id: 2,
        email: "other@example.com",
        role_id: 2,
      });
      // Załóżmy, że serwis rzuca błąd lub kontroler ma logikę sprawdzającą ID użytkownika
      // Jeśli kontroler bezpośrednio porównuje req.user.id z req.params.userId:
      const response = await request(app)
        .get("/api/favorites/users/1") // Próba dostępu do ulubionych użytkownika o ID 1
        .set("Authorization", `Bearer ${otherUserToken}`); // Token użytkownika o ID 2

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden: You can only access your own favorites."
      );
    });

    it("should handle errors when fetching favorites", async () => {
      UserFavoriteService.getFavoritesByUserId.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .get("/api/favorites/users/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error fetching favorites"
      );
      expect(response.body).toHaveProperty("error", "Database error");
    });

    it("should return 400 if userId in path is invalid", async () => {
      // Nie ma potrzeby mockować serwisu w tym przypadku,
      // ponieważ kontroler powinien odrzucić żądanie przed wywołaniem serwisu.
      // UserFavoriteService.getFavoritesByUserId.mockRejectedValue(new Error("This should not be called"));

      const response = await request(app)
        .get("/api/favorites/users/invalidId") // Używamy nieprawidłowego ID w ścieżce
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid User ID");
      // Upewniamy się, że serwis nie został wywołany
      expect(UserFavoriteService.getFavoritesByUserId).not.toHaveBeenCalled();
    });
  });

  describe("addFavorite", () => {
    it("should add a new favorite", async () => {
      const discountIdToAdd = 101;
      const mockAddedFavorite = {
        favorite_id: 3,
        user_id: mockUser.id,
        discount_id: discountIdToAdd,
        added_at: new Date().toISOString(),
      };
      UserFavoriteService.addUserFavorite.mockResolvedValue(mockAddedFavorite);

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ discount_id: discountIdToAdd }); // Wysyłamy tylko discount_id

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockAddedFavorite);
      // Sprawdzamy, czy serwis został wywołany z ID użytkownika z tokenu i przekazanym ID zniżki
      expect(UserFavoriteService.addUserFavorite).toHaveBeenCalledWith(
        mockUser.id,
        discountIdToAdd
      );
    });

    it("should return 401 if no token is provided for POST /favorites", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .send({ discount_id: 101 });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 400 if discount_id is missing", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({}); // Puste ciało

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Discount ID is required and must be a number."
      );
    });

    it("should return 409 if favorite already exists", async () => {
      UserFavoriteService.addUserFavorite.mockRejectedValue(
        new Error("Discount already in favorites")
      );
      const discountIdToAdd = 101;

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ discount_id: discountIdToAdd });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Discount already in favorites"
      );
    });

    it("should handle other errors when adding a favorite", async () => {
      UserFavoriteService.addUserFavorite.mockRejectedValue(
        new Error("Some other database error")
      );
      const discountIdToAdd = 101;

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ discount_id: discountIdToAdd });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error adding favorite");
      expect(response.body).toHaveProperty(
        "error",
        "Some other database error"
      );
    });
  });

  describe("removeFavorite", () => {
    it("should remove a favorite", async () => {
      UserFavoriteService.removeUserFavorite.mockResolvedValue({
        message: "Favorite removed successfully",
      });
      const userIdToRemoveFor = 1;
      const discountIdToRemove = 101;

      const response = await request(app)
        .delete(
          `/api/favorites/users/${userIdToRemoveFor}/${discountIdToRemove}`
        )
        .set("Authorization", `Bearer ${userToken}`); // Token dla użytkownika mockUser.id (czyli 1)

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Favorite removed successfully"
      );
      expect(UserFavoriteService.removeUserFavorite).toHaveBeenCalledWith(
        userIdToRemoveFor,
        discountIdToRemove
      );
    });

    it("should return 401 if no token is provided for DELETE", async () => {
      const response = await request(app).delete("/api/favorites/users/1/101");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 403 if user tries to delete favorite of another user (and is not admin)", async () => {
      const otherUserToken = generateToken({
        id: 2,
        email: "other@example.com",
        role_id: 2,
      });
      const response = await request(app)
        .delete("/api/favorites/users/1/101") // Próba usunięcia ulubionego użytkownika ID 1
        .set("Authorization", `Bearer ${otherUserToken}`); // Token użytkownika ID 2

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden: You can only remove your own favorites."
      );
    });

    it("should return 404 if favorite to remove is not found", async () => {
      UserFavoriteService.removeUserFavorite.mockRejectedValue(
        new Error("Favorite not found or already removed")
      );
      const userIdToRemoveFor = 1;
      const discountIdToRemove = 999; // Załóżmy, że ta zniżka nie jest ulubiona

      const response = await request(app)
        .delete(
          `/api/favorites/users/${userIdToRemoveFor}/${discountIdToRemove}`
        )
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Favorite not found or already removed"
      );
    });

    it("should handle other errors when removing a favorite", async () => {
      UserFavoriteService.removeUserFavorite.mockRejectedValue(
        new Error("Some database error")
      );
      const userIdToRemoveFor = 1;
      const discountIdToRemove = 101;

      const response = await request(app)
        .delete(
          `/api/favorites/users/${userIdToRemoveFor}/${discountIdToRemove}`
        )
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error removing favorite"
      );
      expect(response.body).toHaveProperty("error", "Some database error");
    });
  });
});
