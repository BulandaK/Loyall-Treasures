const DiscountRating = require("../models/discountRatingModel");

class DiscountRatingController {
  // Pobierz oceny dla konkretnej zniżki
  static async getRatingsByDiscount(req, res) {
    try {
      const ratings = await DiscountRating.query().where(
        "discount_id",
        req.params.discountId
      );
      res.status(200).json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching ratings", error });
    }
  }

  // Dodaj nową ocenę
  static async addRating(req, res) {
    try {
      const newRating = await DiscountRating.query().insert(req.body);
      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ message: "Error adding rating", error });
    }
  }

  // Usuń ocenę
  static async deleteRating(req, res) {
    try {
      const rowsDeleted = await DiscountRating.query().deleteById(
        req.params.id
      );
      if (!rowsDeleted) {
        return res.status(404).json({ message: "Rating not found" });
      }
      res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting rating", error });
    }
  }
}

module.exports = DiscountRatingController;
