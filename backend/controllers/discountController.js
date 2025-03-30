// filepath: /Users/kamil/Desktop/ztpai/Loyall-Treasures/backend/controllers/DiscountController.js
const Discount = require("../models/Discount");

class DiscountController {
  // Pobierz wszystkie zniżki
  static async getAllDiscounts(req, res) {
    try {
      const discounts = await Discount.query().withGraphFetched(
        "[location, category, createdBy]"
      );
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching discounts", error });
    }
  }

  // Pobierz zniżkę po ID
  static async getDiscountById(req, res) {
    try {
      const discount = await Discount.query()
        .findById(req.params.id)
        .withGraphFetched("[location, category, createdBy]");
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.status(200).json(discount);
    } catch (error) {
      res.status(500).json({ message: "Error fetching discount", error });
    }
  }

  // Dodaj nową zniżkę
  static async createDiscount(req, res) {
    try {
      const newDiscount = await Discount.query().insert(req.body);
      res.status(201).json(newDiscount);
    } catch (error) {
      res.status(500).json({ message: "Error creating discount", error });
    }
  }

  // Zaktualizuj zniżkę
  static async updateDiscount(req, res) {
    try {
      const updatedDiscount = await Discount.query().patchAndFetchById(
        req.params.id,
        req.body
      );
      if (!updatedDiscount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.status(200).json(updatedDiscount);
    } catch (error) {
      res.status(500).json({ message: "Error updating discount", error });
    }
  }

  // Usuń zniżkę
  static async deleteDiscount(req, res) {
    try {
      const rowsDeleted = await Discount.query().deleteById(req.params.id);
      if (!rowsDeleted) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting discount", error });
    }
  }
}

module.exports = DiscountController;
