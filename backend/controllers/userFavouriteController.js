const UserFavorite = require("../models/UserFavorite");

class UserFavoriteController {
  // Pobierz ulubione zniżki użytkownika
  static async getFavoritesByUser(req, res) {
    try {
      const favorites = await UserFavorite.query()
        .where("user_id", req.params.userId)
        .withGraphFetched("discount");
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites", error });
    }
  }

  // Dodaj zniżkę do ulubionych
  static async addFavorite(req, res) {
    try {
      const newFavorite = await UserFavorite.query().insert(req.body);
      res.status(201).json(newFavorite);
    } catch (error) {
      res.status(500).json({ message: "Error adding favorite", error });
    }
  }

  // Usuń zniżkę z ulubionych
  static async removeFavorite(req, res) {
    try {
      const rowsDeleted = await UserFavorite.query()
        .delete()
        .where("user_id", req.params.userId)
        .andWhere("discount_id", req.params.discountId);
      if (!rowsDeleted) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite", error });
    }
  }
}

module.exports = UserFavoriteController;
