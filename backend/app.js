const express = require("express");
const app = express();
const dbSetup = require("./db");
const routes = require("./routes");

dbSetup();

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
