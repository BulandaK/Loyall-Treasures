require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import pakietu cors
const dbSetup = require("./db");
const routes = require("./routes");
const favoriteRoutes = require("./routes/userFavoriteRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const passport = require("./passport");
const notificationService = require("./services/notificationService");

const app = express();

dbSetup();
notificationService.connectRabbitMQ().catch((err) => {
  console.error("Initial RabbitMQ connection failed:", err);
});

// Konfiguracja CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api", routes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
