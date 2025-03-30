const express = require("express");
const router = express.Router();
const userFavoriteController = require("../controllers/userFavoriteController");

router.get("/users/:userId", userFavoriteController.getFavoritesByUser);
router.post("/", userFavoriteController.addFavorite);
router.delete(
  "/users/:userId/:discountId",
  userFavoriteController.removeFavorite
);

module.exports = router;
