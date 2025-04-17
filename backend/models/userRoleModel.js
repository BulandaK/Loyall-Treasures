const { Model } = require("objection");

class UserRole extends Model {
  static get tableName() {
    return "user_roles";
  }

  static get idColumn() {
    return "role_id";
  }

  static get relationMappings() {
    const User = require("./userModel");

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "user_roles.role_id",
          to: "users.role_id",
        },
      },
    };
  }
}

module.exports = UserRole;
