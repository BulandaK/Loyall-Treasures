const DiscountCategoryService = require("../services/discountCategoryService");

class DiscountCategoryController {
  // Pobierz wszystkie kategorie
  static async getAllCategories(req, res) {
    try {
      const categories = await DiscountCategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const category = await DiscountCategoryService.getCategoryById(
        req.params.id
      );
      res.status(200).json(category);
    } catch (error) {
      if (error.message === "Category not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Dodaj nową kategorię
  static async createCategory(req, res) {
    try {
      const newCategory = await DiscountCategoryService.createCategory(
        req.body
      );
      res.status(201).json(newCategory);
    } catch (error) {
      if (error.message === "Valid name is required") {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "Category with this name already exists") {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const updatedCategory = await DiscountCategoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      if (error.message === "Category not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      await DiscountCategoryService.deleteCategory(req.params.id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      if (error.message === "Category not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DiscountCategoryController;
