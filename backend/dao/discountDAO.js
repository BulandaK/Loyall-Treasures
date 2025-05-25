const Discount = require("../models/discountModel");

class DiscountDAO {
  static async findAllWithRelations() {
    return await Discount.query().withGraphFetched(
      "[location, category, createdBy]"
    );
  }

  static async findByIdWithRelations(discountId) {
    return await Discount.query()
      .findById(discountId)
      .withGraphFetched("[location, category, createdBy]");
  }

  static async createDiscount(discountData) {
    return await Discount.query().insert(discountData);
  }

  static async updateDiscount(discountId, updateData) {
    return await Discount.query().patchAndFetchById(discountId, updateData);
  }

  static async deleteDiscount(discountId) {
    return await Discount.query().deleteById(discountId);
  }
}

module.exports = DiscountDAO;
