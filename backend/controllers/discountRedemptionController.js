const DiscountRedemption = require("../models/discountRedemptionModel");

class DiscountRedemptionController {
  // Pobierz historię odebranych zniżek dla użytkownika
  static async getRedemptionsByUser(req, res) {
    try {
      const redemptions = await DiscountRedemption.query()
        .where("user_id", req.params.userId)
        .withGraphFetched("[discount, location]");
      res.status(200).json(redemptions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching redemptions", error });
    }
  }

  // Dodaj nową historię odebrania zniżki
  static async addRedemption(req, res) {
    try {
      const newRedemption = await DiscountRedemption.query().insert(req.body);
      res.status(201).json(newRedemption);
    } catch (error) {
      res.status(500).json({ message: "Error adding redemption", error });
    }
  }

  // Usuń historię odebrania zniżki
  static async deleteRedemption(req, res) {
    try {
      const rowsDeleted = await DiscountRedemption.query().deleteById(
        req.params.id
      );
      if (!rowsDeleted) {
        return res.status(404).json({ message: "Redemption not found" });
      }
      res.status(200).json({ message: "Redemption deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting redemption", error });
    }
  }
}

module.exports = DiscountRedemptionController;
