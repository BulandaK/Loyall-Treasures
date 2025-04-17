// const request = require("supertest");
// const app = require("../app");

// describe("Location Routes", () => {
//   it("GET /api/locations - powinno zwrócić wszystkie lokalizacje", async () => {
//     const response = await request(app).get("/api/locations");
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   it("GET /api/locations/:id - powinno zwrócić lokalizację po ID", async () => {
//     const response = await request(app).get("/api/locations/1");
//     if (response.status === 200) {
//       expect(response.body).toHaveProperty("location_id", 1);
//     } else {
//       expect(response.status).toBe(404);
//     }
//   });

//   it("POST /api/locations - powinno dodać nową lokalizację", async () => {
//     const newLocation = { name: "Test Location", city_id: 1 };
//     const response = await request(app)
//       .post("/api/locations")
//       .send(newLocation);
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.name).toBe(newLocation.name);
//   });

//   it("PUT /api/locations/:id - powinno zaktualizować lokalizację", async () => {
//     const updatedLocation = { name: "Updated Location" };
//     const response = await request(app)
//       .put("/api/locations/1")
//       .send(updatedLocation);
//     if (response.status === 200) {
//       expect(response.body.name).toBe(updatedLocation.name);
//     } else {
//       expect(response.status).toBe(404);
//     }
//   });

//   it("DELETE /api/locations/:id - powinno usunąć lokalizację", async () => {
//     const response = await request(app).delete("/api/locations/1");
//     if (response.status === 200) {
//       expect(response.body).toHaveProperty("message", "Location deleted");
//     } else {
//       expect(response.status).toBe(404);
//     }
//   });
// });
