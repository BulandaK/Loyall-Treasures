// const request = require("supertest");
// const app = require("../app");

// describe("User Routes", () => {
//   it("GET /api/users - powinno zwrócić wszystkich użytkowników", async () => {
//     const response = await request(app).get("/api/users");
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   it("GET /api/users/:id - powinno zwrócić użytkownika po ID", async () => {
//     const response = await request(app).get("/api/users/1");
//     if (response.status === 200) {
//       expect(response.body).toHaveProperty("id", 1);
//     } else {
//       expect(response.status).toBe(404);
//     }
//   });

//   it("POST /api/users - powinno dodać nowego użytkownika", async () => {
//     const newUser = { name: "Test User", email: "test@example.com" };
//     const response = await request(app).post("/api/users").send(newUser);
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.name).toBe(newUser.name);
//   });

//   it("PUT /api/users/:id - powinno zaktualizować użytkownika", async () => {
//     const updatedUser = { name: "Updated User" };
//     const response = await request(app).put("/api/users/1").send(updatedUser);
//     if (response.status === 200) {
//       expect(response.body.name).toBe(updatedUser.name);
//     } else {
//       expect(response.status).toBe(404);
//     }
//   });

//   it("DELETE /api/users/:id - powinno usunąć użytkownika", async () => {
//     const response = await request(app).delete("/api/users/1");
//     if (response.status === 200) {
//       expect(response.body).toHaveProperty("message", "User deleted");
//     } else {
//       expect(response.status).toBe(404);
//     }
//   });
// });
