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
      res
        .status(500)
        .json({ message: "Error adding redemption", error: error.message });
    }
  }

  // Usuń historię odebrania zniżki - nieużywane w tym scenariuszu, ale zostawiam
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

  // NOWA METODA: Sprawdź status odebrania zniżki
  static async getRedemptionStatus(req, res) {
    try {
      const { userId, discountId } = req.params;
      const redemption = await DiscountRedemption.query()
        .where("user_id", userId)
        .andWhere("discount_id", discountId)
        .first();

      if (redemption) {
        res
          .status(200)
          .json({ redeemed: true, redeemed_at: redemption.redeemed_at });
      } else {
        res.status(200).json({ redeemed: false }); // Zwracamy 200 z informacją, że nie odebrano
      }
    } catch (error) {
      console.error("Error fetching redemption status:", error);
      res
        .status(500)
        .json({
          message: "Error fetching redemption status",
          error: error.message,
        });
    }
  }
}

module.exports = DiscountRedemptionController;
