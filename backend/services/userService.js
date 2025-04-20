const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserDAO = require("../dao/userDAO");

class UserService {
  // Pobierz wszystkich użytkowników z rolami
  static async getAllUsers() {
    return await UserDAO.findAllWithRoles();
  }

  // Pobierz użytkownika po ID
  static async getUserById(userId) {
    const user = await UserDAO.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // Dodaj nowego użytkownika
  static async createUser(data) {
    const { username, email, password, first_name, last_name, role_id } = data;

    if (!email || !password || !first_name || !last_name) {
      throw new Error("All fields are required");
    }

    const existingUser = await UserDAO.findByEmail(email);
    if (existingUser) {
      throw new Error("Email must be unique");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await UserDAO.createUser({
      username,
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      role_id,
    });
  }

  // Zaloguj użytkownika
  static async loginUser(email, password) {
    const user = await UserDAO.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email");
      error.statusCode = 404; // Dodajemy kod statusu do błędu
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401; // Dodajemy kod statusu do błędu
      throw error;
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token };
  }

  // Zaktualizuj użytkownika
  static async updateUser(userId, updateData) {
    const updatedUser = await UserDAO.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }

  // Usuń użytkownika
  static async deleteUser(userId) {
    const rowsDeleted = await UserDAO.deleteUser(userId);
    if (!rowsDeleted) {
      throw new Error("User not found");
    }
    return rowsDeleted;
  }
}

module.exports = UserService;
