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

      // Walidacja nazwy
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Valid name is required" });
      }

      // Sprawdź czy kategoria o takiej nazwie już istnieje
      const existingCategory = await DiscountCategory.query()
        .where("name", name.trim())
        .first();

      if (existingCategory) {
        return res
          .status(409)
          .json({ message: "Category with this name already exists" });
      }

      // Przygotuj dane do wstawienia
      const categoryData = {
        name: name.trim(),
        description: req.body.description || null,
        icon: req.body.icon || null,
      };

      // Utwórz nową kategorię
      const newCategory = await DiscountCategory.query().insert(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        message: "Error creating category",
        error: error.message,
      });
    }
  }
}

module.exports = DiscountCategoryController;
