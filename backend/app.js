require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import pakietu cors
const dbSetup = require("./db");
const routes = require("./routes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const passport = require("./passport");

const app = express();

dbSetup();

// Konfiguracja CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Adres frontendu
    methods: ["GET", "POST", "PUT", "DELETE"], // Dozwolone metody
    credentials: true, // Jeśli używasz ciasteczek lub uwierzytelniania
  })
);

app.use(express.json());
app.use(passport.initialize());

// Dodajemy routing
// Endpoint dokumentacji Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});
// Obsługa błędów 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Obsługa błędów 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
