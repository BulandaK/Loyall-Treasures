const UserFavoriteDAO = require("../dao/userFavoriteDAO");

class UserFavoriteController {
  static async getFavoritesByUser(req, res) {
    try {
      const favorites = await UserFavoriteDAO.findFavoritesByUser(
        req.params.userId
      );
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites", error });
    }
  }

  static async addFavorite(req, res) {
    try {
      const newFavorite = await UserFavoriteDAO.addFavorite(req.body);
      res.status(201).json(newFavorite);
    } catch (error) {
      res.status(500).json({ message: "Error adding favorite", error });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const rowsDeleted = await UserFavoriteDAO.removeFavorite(
        req.params.userId,
        req.params.discountId
      );
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
