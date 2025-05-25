const DiscountCategory = require("../models/discountCategoryModel");

class DiscountCategoryService {
  static async getAllCategories() {
    try {
      return await DiscountCategory.query();
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  static async getCategoryById(id) {
    try {
      const category = await DiscountCategory.query().findById(id);

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    } catch (error) {
      throw new Error("Error fetching category");
    }
  }

  static async createCategory(categoryData) {
    try {
      const { name } = categoryData;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new Error("Valid name is required");
      }

      const existingCategory = await DiscountCategory.query()
        .where("name", name.trim())
        .first();

      if (existingCategory) {
        throw new Error("Category with this name already exists");
      }

      const data = {
        name: name.trim(),
        description: categoryData.description || null,
        icon: categoryData.icon || null,
      };

      return await DiscountCategory.query().insert(data);
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const updatedCategory = await DiscountCategory.query().patchAndFetchById(
        id,
        categoryData
      );

      if (!updatedCategory) {
        throw new Error("Category not found");
      }

      return updatedCategory;
    } catch (error) {
      throw new Error("Error updating category");
    }
  }

  static async deleteCategory(id) {
    try {
      const rowsDeleted = await DiscountCategory.query().deleteById(id);

      if (!rowsDeleted) {
        throw new Error("Category not found");
      }

      return true;
    } catch (error) {
      throw new Error("Error deleting category");
    }
  }
}

module.exports = DiscountCategoryService;
