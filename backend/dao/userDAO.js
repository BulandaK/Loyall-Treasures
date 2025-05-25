const User = require("../models/userModel");

class UserDAO {
  static async findById(userId) {
    return await User.query().findById(userId).withGraphFetched("role");
  }

  static async findByEmail(email) {
    return await User.query().findOne({ email });
  }

  static async existsByEmail(email) {
    const user = await User.query().findOne({ email });
    return !!user;
  }

  static async findByUsername(username) {
    return await User.query().findOne({ username });
  }

  static async findByRole(roleId) {
    return await User.query().where({ role_id: roleId });
  }

  static async findAllWithRoles() {
    return await User.query().withGraphFetched("role");
  }

  static async createUser(userData) {
    return await User.query().insert(userData);
  }

  static async updateUser(userId, updateData) {
    return await User.query().patchAndFetchById(userId, updateData);
  }

  static async deleteUser(userId) {
    return await User.query().deleteById(userId);
  }

  static async countUsers() {
    const result = await User.query().count("user_id as count");
    return result[0].count;
  }

  static async deleteAll() {
    return await User.query().delete();
  }
}

module.exports = UserDAO;
