const request = require("supertest");
const app = require("../app");
const setupDB = require("../db");
const jwt = require("jsonwebtoken");

let knex;

const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  knex = setupDB();
  await knex.migrate.latest();
  await knex.raw("PRAGMA foreign_keys = ON");
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  await knex("users").truncate();
  await knex("user_roles").truncate();

  await knex("user_roles").insert([
    { role_id: 1, role_name: "Admin", description: "Administrator role" },
    { role_id: 2, role_name: "User", description: "Regular user role" },
  ]);
});

describe("UserController", () => {
  describe("getAllUsers", () => {
    it("should return all users", async () => {
      await knex("users").insert([
        {
          username: "user1",
          email: "user1@example.com",
          password_hash: "hashedpassword1",
          first_name: "John",
          last_name: "Doe",
          role_id: 1,
        },
        {
          username: "user2",
          email: "user2@example.com",
          password_hash: "hashedpassword2",
          first_name: "Jane",
          last_name: "Smith",
          role_id: 2,
        },
      ]);
      const adminToken = generateToken({
        user_id: 1,
        email: "user1@example.com",
        role_id: 1,
      });
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: "user1@example.com" }),
          expect.objectContaining({ email: "user2@example.com" }),
        ])
      );
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const insertedUser = await knex("users")
        .insert(
          {
            username: "user1",
            email: "user1@example.com",
            password_hash: "hashedpassword1",
            first_name: "John",
            last_name: "Doe",
            role_id: 1,
          },
          ["user_id"]
        )
        .returning("user_id");
      const userId = insertedUser[0]?.user_id || insertedUser[0];

      const adminToken = generateToken({
        user_id: userId,
        email: "user1@example.com",
        role_id: 1,
      });

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("email", "user1@example.com");
    });

    it("should return 404 if user is not found", async () => {
      const adminToken = generateToken({
        user_id: 1,
        email: "user1@example.com",
        role_id: 1,
      });

      const response = await request(app)
        .get("/api/users/999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        first_name: "New",
        last_name: "User",
        role_id: 2,
      };

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("email", "newuser@example.com");

      const userInDB = await knex("users")
        .where({ email: "newuser@example.com" })
        .first();
      expect(userInDB).toBeDefined();
      expect(userInDB).toHaveProperty("first_name", "New");
    });

    it("should return 422 if email already exists", async () => {
      await knex("users").insert({
        username: "existinguser",
        email: "duplicate@example.com",
        password_hash: "hashedpassword",
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      });

      const response = await request(app).post("/api/users").send({
        username: "newuser",
        email: "duplicate@example.com",
        password: "password123",
        first_name: "Jane",
        last_name: "Smith",
        role_id: 2,
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("message", "Email must be unique");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/users").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "All fields are required"
      );
    });
  });

  describe("loginUser", () => {
    it("should log in a user and return a token", async () => {
      const hashedPassword = await require("bcrypt").hash("password123", 10);
      await knex("users").insert({
        username: "user1",
        email: "user1@example.com",
        password_hash: hashedPassword,
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      });

      const response = await request(app).post("/api/users/login").send({
        email: "user1@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 404 if email is invalid", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "invalid@example.com",
        password: "password123",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Invalid email");
    });

    it("should return 401 if password is invalid", async () => {
      const hashedPassword = await require("bcrypt").hash("password123", 10);
      await knex("users").insert({
        username: "user1",
        email: "user1@example.com",
        password_hash: hashedPassword,
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      });

      const response = await request(app).post("/api/users/login").send({
        email: "user1@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid password");
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const insertedUser = await knex("users")
        .insert(
          {
            username: "user1",
            email: "user1@example.com",
            password_hash: "hashedpassword1",
            first_name: "John",
            last_name: "Doe",
            role_id: 1,
          },
          ["user_id"]
        )
        .returning("user_id");
      const userId = insertedUser[0].user_id || insertedUser[0];

      const adminToken = generateToken({
        user_id: userId,
        email: "user1@example.com",
        role_id: 1,
      });

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ first_name: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("first_name", "Updated");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const insertedUser = await knex("users")
        .insert(
          {
            username: "user1",
            email: "user1@example.com",
            password_hash: "hashedpassword1",
            first_name: "John",
            last_name: "Doe",
            role_id: 1,
          },
          ["user_id"]
        )
        .returning("user_id");
      const userId = insertedUser[0].user_id || insertedUser[0];

      const adminToken = generateToken({
        user_id: userId,
        email: "user1@example.com",
        role_id: 1,
      });

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User deleted successfully"
      );

      const userInDB = await knex("users").where({ user_id: userId }).first();
      expect(userInDB).toBeUndefined();
    });
  });
});
