const DiscountDAO = require("../dao/discountDAO");

class DiscountService {
  static async getAllDiscounts() {
    return await DiscountDAO.findAllWithRelations();
  }

  static async getDiscountById(discountId) {
    const discount = await DiscountDAO.findByIdWithRelations(discountId);
    if (!discount) {
      throw new Error("Discount not found");
    }
    return discount;
  }

  static async createDiscount(discountData) {
    return await DiscountDAO.createDiscount(discountData);
  }

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

  static async deleteDiscount(discountId) {
    const rowsDeleted = await DiscountDAO.deleteDiscount(discountId);
    if (!rowsDeleted) {
      throw new Error("Discount not found");
    }
    return rowsDeleted;
  }
}

module.exports = DiscountService;
