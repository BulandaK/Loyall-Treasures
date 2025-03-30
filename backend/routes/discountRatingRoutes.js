const express = require("express");
const router = express.Router();
const discountRatingController = require("../controllers/discountRatingController");

// Pobierz oceny dla zniżki
router.get(
  "/discounts/:discountId",
  discountRatingController.getRatingsByDiscount
);

// Dodaj ocenę
router.post("/", discountRatingController.addRating);

// Usuń ocenę
router.delete("/:id", discountRatingController.deleteRating);

module.exports = router;
