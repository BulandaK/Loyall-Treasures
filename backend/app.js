require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import pakietu cors
const app = express();
const dbSetup = require("./db");
const routes = require("./routes");

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

// Dodajemy routing
app.use("/api", routes);

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
