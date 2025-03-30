const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }

  static get relationMappings() {
    const UserRole = require("./UserRole");
    const Discount = require("./Discount");

    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserRole,
        join: {
          from: "users.role_id",
          to: "user_roles.role_id",
        },
      },
      createdDiscounts: {
        relation: Model.HasManyRelation,
        modelClass: Discount,
        join: {
          from: "users.user_id",
          to: "discounts.created_by",
        },
      },
    };
  }
}

module.exports = User;
