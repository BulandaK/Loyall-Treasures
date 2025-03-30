const express = require("express");
const router = express.Router();
const discountRedemptionController = require("../controllers/discountRedemptionController");

// Pobierz historię odebranych zniżek dla użytkownika
router.get("/users/:userId", discountRedemptionController.getRedemptionsByUser);

// Dodaj nową historię odebrania zniżki
router.post("/", discountRedemptionController.addRedemption);

module.exports = router;
