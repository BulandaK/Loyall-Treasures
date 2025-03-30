const User = require("../models/userModel");

console.log("User model:", User);

class UserController {
  // Pobierz wszystkich użytkowników
  static async getAllUsers(req, res) {
    try {
      const users = await User.query().withGraphFetched("role");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  }

  // Pobierz użytkownika po ID
  static async getUserById(req, res) {
    try {
      const user = await User.query()
        .findById(req.params.id)
        .withGraphFetched("role");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  }

  // Dodaj nowego użytkownika
  static async createUser(req, res) {
    try {
      console.log("Request body:", req.body);
      const newUser = await User.query().insert(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  // Zaktualizuj użytkownika
  static async updateUser(req, res) {
    try {
      const updatedUser = await User.query().patchAndFetchById(
        req.params.id,
        req.body
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  }

  // Usuń użytkownika
  static async deleteUser(req, res) {
    try {
      const rowsDeleted = await User.query().deleteById(req.params.id);
      if (!rowsDeleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  }
}

module.exports = UserController;
