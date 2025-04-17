const { Model } = require("objection");

class DiscountRating extends Model {
  static get tableName() {
    return "discount_ratings";
  }

  static get idColumn() {
    return "rating_id";
  }

  static get relationMappings() {
    const Discount = require("./dicountModel");
    const User = require("./userModel");

    return {
      discount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Discount,
        join: {
          from: "discount_ratings.discount_id",
          to: "discounts.discount_id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "discount_ratings.user_id",
          to: "users.user_id",
        },
      },
    };
  }
}

module.exports = DiscountRating;
