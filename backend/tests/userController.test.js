const request = require("supertest");
const app = require("../app");
const setupDB = require("../db");

let knex;

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Ustawiamy środowisko na 'test'
  knex = setupDB(); // Inicjalizujemy połączenie z bazą danych testową
  await knex.migrate.latest(); // Uruchamiamy migracje
  await knex.raw("PRAGMA foreign_keys = ON"); // Włączamy klucze obce dla SQLite3
});

afterAll(async () => {
  await knex.destroy(); // Zamykamy połączenie z bazą danych
});

beforeEach(async () => {
  // Czyszczenie tabeli przed każdym testem
  await knex("users").truncate();
  await knex("user_roles").truncate();

  // Wstawiamy dane testowe dla ról
  await knex("user_roles").insert([
    { role_id: 1, role_name: "Admin", description: "Administrator role" },
    { role_id: 2, role_name: "User", description: "Regular user role" },
  ]);
});

describe("UserController", () => {
  describe("getAllUsers", () => {
    it("should return all users", async () => {
      // Wstawiamy dane testowe do bazy
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

      // Wykonujemy żądanie HTTP
      const response = await request(app).get("/api/users");

      // Sprawdzamy odpowiedź
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
      // Wstawiamy dane testowe do bazy
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

      // Wykonujemy żądanie HTTP
      const response = await request(app).get(`/api/users/${userId}`);

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("email", "user1@example.com");
    });

    it("should return 404 if user is not found", async () => {
      const response = await request(app).get("/api/users/999");

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

      // Wykonujemy żądanie HTTP
      const response = await request(app).post("/api/users").send(newUser);

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("email", "newuser@example.com");

      // Sprawdzamy, czy dane zostały zapisane w bazie
      const userInDB = await knex("users")
        .where({ email: "newuser@example.com" })
        .first();
      expect(userInDB).toBeDefined();
      expect(userInDB).toHaveProperty("first_name", "New");
    });

    it("should return 422 if email already exists", async () => {
      // Wstawiamy użytkownika do bazy
      await knex("users").insert({
        username: "existinguser",
        email: "duplicate@example.com",
        password_hash: "hashedpassword",
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      });

      // Próba dodania użytkownika z tym samym emailem
      const response = await request(app).post("/api/users").send({
        username: "newuser",
        email: "duplicate@example.com", // Ten sam email
        password: "password123",
        first_name: "Jane",
        last_name: "Smith",
        role_id: 2,
      });

      // Sprawdzamy odpowiedź
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
      // Wstawiamy użytkownika do bazy
      const hashedPassword = await require("bcrypt").hash("password123", 10);
      await knex("users").insert({
        username: "user1",
        email: "user1@example.com",
        password_hash: hashedPassword,
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      });

      // Wykonujemy żądanie HTTP
      const response = await request(app).post("/api/users/login").send({
        email: "user1@example.com",
        password: "password123",
      });

      // Sprawdzamy odpowiedź
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
      // Wstawiamy użytkownika do bazy
      const hashedPassword = await require("bcrypt").hash("password123", 10);
      await knex("users").insert({
        username: "user1",
        email: "user1@example.com",
        password_hash: hashedPassword,
        first_name: "John",
        last_name: "Doe",
        role_id: 1,
      });

      // Wykonujemy żądanie HTTP
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
      // Wstawiamy użytkownika do bazy
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

      // Wykonujemy żądanie HTTP
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ first_name: "Updated" });

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("first_name", "Updated");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      // Wstawiamy użytkownika do bazy
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

      // Wykonujemy żądanie HTTP
      const response = await request(app).delete(`/api/users/${userId}`);

      // Sprawdzamy odpowiedź
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User deleted successfully"
      );

      // Sprawdzamy, czy użytkownik został usunięty z bazy
      const userInDB = await knex("users").where({ user_id: userId }).first();
      expect(userInDB).toBeUndefined();
    });
  });
});
