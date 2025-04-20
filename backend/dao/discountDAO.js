const Discount = require("../models/discountModel");

class DiscountDAO {
  // Pobierz wszystkie zniżki z relacjami
  static async findAllWithRelations() {
    return await Discount.query().withGraphFetched(
      "[location, category, createdBy]"
    );
  }

  // Pobierz zniżkę po ID z relacjami
  static async findByIdWithRelations(discountId) {
    return await Discount.query()
      .findById(discountId)
      .withGraphFetched("[location, category, createdBy]");
  }

  // Dodaj nową zniżkę
  static async createDiscount(discountData) {
    return await Discount.query().insert(discountData);
  }

  // Zaktualizuj zniżkę po ID
  static async updateDiscount(discountId, updateData) {
    return await Discount.query().patchAndFetchById(discountId, updateData);
  }

  // Usuń zniżkę po ID
  static async deleteDiscount(discountId) {
    return await Discount.query().deleteById(discountId);
  }
}

module.exports = DiscountDAO;
