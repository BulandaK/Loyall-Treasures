const UserService = require("../services/userService");

class UserController {
  // Pobierz wszystkich użytkowników
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  }

  // Pobierz użytkownika po ID
  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res
        .status(error.message === "User not found" ? 404 : 500)
        .json({ message: error.message });
    }
  }

  // Dodaj nowego użytkownika
  static async createUser(req, res) {
    try {
      const newUser = await UserService.createUser(req.body);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res
        .status(error.message === "Email must be unique" ? 422 : 400)
        .json({ message: error.message });
    }
  }

  // Zaloguj użytkownika
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const { token } = await UserService.loginUser(email, password);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  // Zaktualizuj użytkownika
  static async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      res
        .status(error.message === "User not found" ? 404 : 500)
        .json({ message: error.message });
    }
  }

  // Usuń użytkownika
  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(error.message === "User not found" ? 404 : 500)
        .json({ message: error.message });
    }
  }
}

module.exports = UserController;
