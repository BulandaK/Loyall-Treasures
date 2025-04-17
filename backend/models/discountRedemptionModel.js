const { Model } = require("objection");

class DiscountRedemption extends Model {
  static get tableName() {
    return "discount_redemptions";
  }

  static get idColumn() {
    return "redemption_id";
  }

  static get relationMappings() {
    const Discount = require("./discountModel");
    const User = require("./userModel");
    const Location = require("./locationModel");

    return {
      discount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Discount,
        join: {
          from: "discount_redemptions.discount_id",
          to: "discounts.discount_id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "discount_redemptions.user_id",
          to: "users.user_id",
        },
      },
      location: {
        relation: Model.BelongsToOneRelation,
        modelClass: Location,
        join: {
          from: "discount_redemptions.location_id",
          to: "locations.location_id",
        },
      },
    };
  }
}

module.exports = DiscountRedemption;
