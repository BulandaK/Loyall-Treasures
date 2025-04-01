const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Znajdź użytkownika po emailu
      const user = await User.query().findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
      }

      // Sprawdź poprawność hasła
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generuj token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Error logging in user", error });
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
