const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserDAO = require("../dao/userDAO"); //
const { sendUserRegistrationNotification } = require("./notificationService"); // <--- NOWY IMPORT

class UserService {
  static async getAllUsers() {
    return await UserDAO.findAllWithRoles(); //
  }

  static async getUserById(userId) {
    const user = await UserDAO.findById(userId); //
    if (!user) {
      throw new Error("User not found"); //
    }
    return user; //
  }

  static async createUser(data) {
    const { username, email, password, first_name, last_name, role_id } = data; //

    if (!email || !password || !first_name || !last_name) {
      //
      throw new Error("All fields are required"); //
    }

    const existingUser = await UserDAO.findByEmail(email); //
    if (existingUser) {
      //
      throw new Error("Email must be unique"); //
    }

    const hashedPassword = await bcrypt.hash(password, 10); //

    const newUser = await UserDAO.createUser({
      //
      username,
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      role_id,
    });

    // Wysyłanie powiadomienia po pomyślnym utworzeniu użytkownika
    if (newUser) {
      // Przygotowujemy dane, które chcemy wysłać w powiadomieniu
      const notificationData = {
        userId: newUser.user_id, // Zakładając, że user_id jest zwracane
        email: newUser.email,
        firstName: newUser.first_name,
        registrationDate: new Date().toISOString(),
      };
      // Nie czekamy na wynik wysłania (fire and forget)
      sendUserRegistrationNotification(notificationData).catch(console.error);
    }

    return newUser; //
  }

  static async loginUser(email, password) {
    //
    const user = await UserDAO.findByEmail(email); //
    if (!user) {
      //
      const error = new Error("Invalid email"); //
      error.statusCode = 404; //
      throw error; //
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash); //
    if (!isPasswordValid) {
      //
      const error = new Error("Invalid password"); //
      error.statusCode = 401; //
      throw error; //
    }
    console.log("Token payload:", {
      //
      id: user.user_id,
      email: user.email,
      role_id: user.role_id,
    });

    const token = jwt.sign(
      //
      { id: user.user_id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated token:", token); //

    return { token }; //
  }

  static async updateUser(userId, updateData) {
    //
    const updatedUser = await UserDAO.updateUser(userId, updateData); //
    if (!updatedUser) {
      //
      throw new Error("User not found"); //
    }
    return updatedUser; //
  }

  static async deleteUser(userId) {
    //
    const rowsDeleted = await UserDAO.deleteUser(userId); //
    if (!rowsDeleted) {
      //
      throw new Error("User not found"); //
    }
    return rowsDeleted; //
  }
}

module.exports = UserService; //
