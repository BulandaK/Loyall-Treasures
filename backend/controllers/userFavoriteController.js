// backend/controllers/userFavoriteController.js
const UserFavoriteService = require("../services/userFavoriteService"); // Używamy serwisu

class UserFavoriteController {
  static async getFavoritesByUser(req, res) {
    try {
      const userId = req.params.userId;

      // First check if userId is valid
      if (isNaN(parseInt(userId, 10))) {
        return res.status(400).json({ message: "Invalid User ID" });
      }

      // Then check authorization
      if (req.user.id !== parseInt(userId, 10) && req.user.role_id !== 1) {
        return res.status(403).json({
          message: "Forbidden: You can only access your own favorites.",
        });
      }

      const favorites = await UserFavoriteService.getFavoritesByUserId(userId);
      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error in getFavoritesByUser:", error);
      res
        .status(500)
        .json({ message: "Error fetching favorites", error: error.message });
    }
  }

  static async addFavorite(req, res) {
    try {
      const userId = parseInt(req.user.id, 10); // Pobieramy ID zalogowanego użytkownika z tokenu
      const discountId = parseInt(req.body.discount_id, 10);

      if (isNaN(discountId)) {
        return res
          .status(400)
          .json({ message: "Discount ID is required and must be a number." });
      }

      const newFavorite = await UserFavoriteService.addUserFavorite(
        userId,
        discountId
      );
      res.status(201).json(newFavorite);
    } catch (error) {
      console.error("Error in addFavorite:", error);
      if (error.message === "Discount already in favorites") {
        return res.status(409).json({ message: error.message });
      }
      if (
        error.message === "Invalid User ID or Discount ID" ||
        error.message === "User ID and Discount ID are required"
      ) {
        return res.status(400).json({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Error adding favorite", error: error.message });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const discountId = parseInt(req.params.discountId, 10);

      // Sprawdzenie, czy zalogowany użytkownik usuwa ulubione dla samego siebie
      // lub czy jest administratorem (opcjonalne)
      if (req.user.id !== userId && req.user.role_id !== 1) {
        return res.status(403).json({
          message: "Forbidden: You can only remove your own favorites.",
        });
      }

      const result = await UserFavoriteService.removeUserFavorite(
        userId,
        discountId
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in removeFavorite:", error);
      if (error.message === "Favorite not found or already removed") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Invalid User ID or Discount ID") {
        return res.status(400).json({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Error removing favorite", error: error.message });
    }
  }
}

module.exports = UserFavoriteController;
