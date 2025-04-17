const { Model } = require("objection");

class Discount extends Model {
  static get tableName() {
    return "discounts";
  }

  static get idColumn() {
    return "discount_id";
  }

  static get relationMappings() {
    const Location = require("./locationModel");
    const DiscountCategory = require("./discountCategoryModel");
    const User = require("./userModel");

    return {
      location: {
        relation: Model.BelongsToOneRelation,
        modelClass: Location,
        join: {
          from: "discounts.location_id",
          to: "locations.location_id",
        },
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: DiscountCategory,
        join: {
          from: "discounts.category_id",
          to: "discount_categories.category_id",
        },
      },
      createdBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "discounts.created_by",
          to: "users.user_id",
        },
      },
    };
  }
}

module.exports = Discount;
