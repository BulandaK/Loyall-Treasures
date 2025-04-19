const request = require("supertest");
const app = require("../app");
const UserRole = require("../models/userRoleModel");

jest.mock("../models/userRoleModel");

describe("UserRoleController", () => {
  describe("getAllRoles", () => {
    it("should return all roles", async () => {
      const mockRoles = [
        { id: 1, name: "Admin" },
        { id: 2, name: "User" },
      ];
      UserRole.query.mockResolvedValue(mockRoles);

      const response = await request(app).get("/api/roles");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoles);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should handle errors when fetching roles", async () => {
      UserRole.query.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/roles");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error fetching roles");
    });
  });

  describe("createRole", () => {
    it("should create a new role", async () => {
      const newRole = { name: "Moderator" };
      const mockInsertedRole = { id: 1, name: "Moderator" };
      UserRole.query.mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockInsertedRole),
      });

      const response = await request(app).post("/api/roles").send(newRole);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInsertedRole);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newRole.name);
    });

    it("should handle errors when creating a role", async () => {
      UserRole.query.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const response = await request(app)
        .post("/api/roles")
        .send({ name: "Moderator" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error creating role");
    });
  });
});
