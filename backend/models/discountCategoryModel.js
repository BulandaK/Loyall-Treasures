const { Model } = require("objection");

class DiscountCategory extends Model {
  static get tableName() {
    return "discount_categories";
  }

  static get idColumn() {
    return "category_id";
  }

  static get relationMappings() {
    const Discount = require("./discountModel");

    return {
      discounts: {
        relation: Model.HasManyRelation,
        modelClass: Discount,
        join: {
          from: "discount_categories.category_id",
          to: "discounts.category_id",
        },
      },
    };
  }
}

module.exports = DiscountCategory;
