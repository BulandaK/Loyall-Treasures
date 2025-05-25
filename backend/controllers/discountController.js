const DiscountService = require("../services/discountService");

class DiscountController {
  static async getAllDiscounts(req, res) {
    try {
      const discounts = await DiscountService.getAllDiscounts();
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching discounts",
        error: error.message,
      });
    }
  }

  static async getDiscountById(req, res) {
    try {
      const discount = await DiscountService.getDiscountById(req.params.id);
      res.status(200).json(discount);
    } catch (error) {
      if (error.message === "Discount not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: "Error fetching discount",
          error: error.message,
        });
      }
    }
  }

  static async createDiscount(req, res) {
    try {
      const newDiscount = await DiscountService.createDiscount(req.body);
      res.status(201).json(newDiscount);
    } catch (error) {
      res.status(500).json({
        message: "Error creating discount",
        error: error.message,
      });
    }
  }

  static async updateDiscount(req, res) {
    try {
      const updatedDiscount = await DiscountService.updateDiscount(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedDiscount);
    } catch (error) {
      if (error.message === "Discount not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: "Error updating discount",
          error: error.message,
        });
      }
    }
  }

  static async deleteDiscount(req, res) {
    try {
      await DiscountService.deleteDiscount(req.params.id);
      res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
      if (error.message === "Discount not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: "Error deleting discount",
          error: error.message,
        });
      }
    }
  }
}

module.exports = DiscountController;
