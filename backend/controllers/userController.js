const UserDAO = require("../dao/userDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
  // Pobierz wszystkich użytkowników
  static async getAllUsers(req, res) {
    try {
      const users = await UserDAO.findAllWithRoles();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  }

  // Pobierz użytkownika po ID
  static async getUserById(req, res) {
    try {
      const user = await UserDAO.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user", error });
    }
  }

  // Dodaj nowego użytkownika
  static async createUser(req, res) {
    try {
      const { username, email, password, first_name, last_name, role_id } =
        req.body;

      // Sprawdź, czy wszystkie wymagane pola są podane
      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Sprawdź, czy email jest unikalny
      const existingUser = await UserDAO.findByEmail(email);
      if (existingUser) {
        return res.status(422).json({ message: "Email must be unique" });
      }

      // Hashuj hasło
      const hashedPassword = await bcrypt.hash(password, 10);

      // Zapisz użytkownika w bazie danych
      const newUser = await UserDAO.createUser({
        username,
        email,
        password_hash: hashedPassword, // Zapisujemy zahashowane hasło
        first_name,
        last_name,
        role_id,
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  // Zaloguj użytkownika
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Znajdź użytkownika po emailu
      const user = await UserDAO.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Invalid email" });
      }

      // Sprawdź poprawność hasła
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generuj token JWT
      const token = jwt.sign(
        { id: user.user_id, email: user.email, role: user.role_id },
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
      const updatedUser = await UserDAO.updateUser(req.params.id, req.body);
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
      const rowsDeleted = await UserDAO.deleteUser(req.params.id);
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
