const DiscountCategory = require("../models/discountCategoryModel");

class DiscountCategoryController {
  // Pobierz wszystkie kategorie
  static async getAllCategories(req, res) {
    try {
      const categories = await DiscountCategory.query();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories", error });
    }
  }

  // Dodaj nową kategorię
  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const newCategory = await DiscountCategory.query().insert(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Error creating category", error });
    }
  }
}

module.exports = DiscountCategoryController;
