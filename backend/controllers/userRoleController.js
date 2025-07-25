const UserRole = require("../models/userRoleModel");

class UserRoleController {
  static async getAllRoles(req, res) {
    try {
      const roles = await UserRole.query();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching roles", error });
    }
  }

  static async createRole(req, res) {
    try {
      const newRole = await UserRole.query().insert(req.body);
      res.status(201).json(newRole);
    } catch (error) {
      res.status(500).json({ message: "Error creating role", error });
    }
  }
}

module.exports = UserRoleController;
