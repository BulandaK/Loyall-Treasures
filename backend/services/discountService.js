const DiscountDAO = require("../dao/discountDAO");

class DiscountService {
  // Pobierz wszystkie zniżki z relacjami
  static async getAllDiscounts() {
    return await DiscountDAO.findAllWithRelations();
  }

  // Pobierz zniżkę po ID z relacjami
  static async getDiscountById(discountId) {
    const discount = await DiscountDAO.findByIdWithRelations(discountId);
    if (!discount) {
      throw new Error("Discount not found");
    }
    return discount;
  }

  // Dodaj nową zniżkę
  static async createDiscount(discountData) {
    return await DiscountDAO.createDiscount(discountData);
  }

  // Zaktualizuj zniżkę
  static async updateDiscount(discountId, updateData) {
    const updatedDiscount = await DiscountDAO.updateDiscount(
      discountId,
      updateData
    );
    if (!updatedDiscount) {
      throw new Error("Discount not found");
    }
    return updatedDiscount;
  }

  // Usuń zniżkę
  static async deleteDiscount(discountId) {
    const rowsDeleted = await DiscountDAO.deleteDiscount(discountId);
    if (!rowsDeleted) {
      throw new Error("Discount not found");
    }
    return rowsDeleted;
  }
}

module.exports = DiscountService;
