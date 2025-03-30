const { Model } = require("objection");

class UserFavorite extends Model {
  static get tableName() {
    return "user_favorites";
  }

  static get idColumn() {
    return "favorite_id";
  }

  static get relationMappings() {
    const User = require("./User");
    const Discount = require("./Discount");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_favorites.user_id",
          to: "users.user_id",
        },
      },
      discount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Discount,
        join: {
          from: "user_favorites.discount_id",
          to: "discounts.discount_id",
        },
      },
    };
  }
}

module.exports = UserFavorite;
