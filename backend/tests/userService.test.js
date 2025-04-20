const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserDAO = require("../dao/userDAO");
const UserService = require("../services/userService");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../dao/userDAO");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users with roles", async () => {
      const mockUsers = [{ id: 1, name: "John Doe", role: "Admin" }];
      UserDAO.findAllWithRoles.mockResolvedValue(mockUsers);

      const users = await UserService.getAllUsers();

      expect(UserDAO.findAllWithRoles).toHaveBeenCalledTimes(1);
      expect(users).toEqual(mockUsers);
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const mockUser = { id: 1, name: "John Doe" };
      UserDAO.findById.mockResolvedValue(mockUser);

      const user = await UserService.getUserById(1);

      expect(UserDAO.findById).toHaveBeenCalledWith(1);
      expect(user).toEqual(mockUser);
    });

    it("should throw an error if user is not found", async () => {
      UserDAO.findById.mockResolvedValue(null);

      await expect(UserService.getUserById(1)).rejects.toThrow(
        "User not found"
      );
      expect(UserDAO.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockData = {
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      };
      const hashedPassword = "hashedPassword123";
      const mockCreatedUser = {
        id: 1,
        ...mockData,
        password_hash: hashedPassword,
      };

      if (
        !mockData.email ||
        !mockData.password ||
        !mockData.first_name ||
        !mockData.last_name
      ) {
        throw new Error("All fields are required");
      }

      const existingUser = await UserDAO.findByEmail(mockData.email);
      if (existingUser) {
        throw new Error("Email must be unique");
      }

      UserDAO.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      UserDAO.createUser.mockResolvedValue(mockCreatedUser);

      const user = await UserService.createUser(mockData);

      expect(UserDAO.findByEmail).toHaveBeenCalledWith(mockData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
      const { password, ...userDataWithoutPassword } = mockData;
      expect(UserDAO.createUser).toHaveBeenCalledWith({
        ...userDataWithoutPassword,
        password_hash: hashedPassword,
      });
      expect(user).toEqual(mockCreatedUser);
    });

    it("should throw an error if email already exists", async () => {
      const mockData = {
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      };

      UserDAO.findByEmail.mockResolvedValue({
        id: 1,
        email: "john@example.com",
      });

      await expect(UserService.createUser(mockData)).rejects.toThrow(
        "Email must be unique"
      );
      expect(UserDAO.findByEmail).toHaveBeenCalledWith(mockData.email);
    });

    it("should throw an error if required fields are missing", async () => {
      const mockData = { email: "john@example.com" };

      await expect(UserService.createUser(mockData)).rejects.toThrow(
        "All fields are required"
      );
    });
  });

  describe("loginUser", () => {
    it("should return a token if login is successful", async () => {
      const mockUser = {
        user_id: 1,
        email: "john@example.com",
        password_hash: "hashedPassword123",
        role_id: 1,
      };
      const mockToken = "mockToken123";

      UserDAO.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await UserService.loginUser(
        "john@example.com",
        "password123"
      );

      expect(UserDAO.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        mockUser.password_hash
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.user_id, email: mockUser.email, role: mockUser.role_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(result).toEqual({ token: mockToken });
    });

    it("should throw an error if email is invalid", async () => {
      UserDAO.findByEmail.mockResolvedValue(null);

      await expect(
        UserService.loginUser("invalid@example.com", "password123")
      ).rejects.toThrow("Invalid email");
      expect(UserDAO.findByEmail).toHaveBeenCalledWith("invalid@example.com");
    });

    it("should throw an error if password is invalid", async () => {
      const mockUser = {
        user_id: 1,
        email: "john@example.com",
        password_hash: "hashedPassword123",
      };

      UserDAO.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        UserService.loginUser("john@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid password");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        mockUser.password_hash
      );
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const mockUpdatedUser = { id: 1, name: "Updated User" };
      UserDAO.updateUser.mockResolvedValue(mockUpdatedUser);

      const user = await UserService.updateUser(1, { name: "Updated User" });

      expect(UserDAO.updateUser).toHaveBeenCalledWith(1, {
        name: "Updated User",
      });
      expect(user).toEqual(mockUpdatedUser);
    });

    it("should throw an error if user is not found", async () => {
      UserDAO.updateUser.mockResolvedValue(null);

      await expect(
        UserService.updateUser(1, { name: "Updated User" })
      ).rejects.toThrow("User not found");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      UserDAO.deleteUser.mockResolvedValue(1);

      const result = await UserService.deleteUser(1);

      expect(UserDAO.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toBe(1);
    });

    it("should throw an error if user is not found", async () => {
      UserDAO.deleteUser.mockResolvedValue(0);

      await expect(UserService.deleteUser(1)).rejects.toThrow("User not found");
    });
  });
});
