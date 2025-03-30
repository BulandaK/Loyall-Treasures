const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const userRoleRoutes = require("./userRoleRoutes");
const discountRoutes = require("./discountRoutes");
const locationRoutes = require("./locationRoutes");
const discountCategoryRoutes = require("./discountCategoryRoutes");
const userFavoriteRoutes = require("./userFavoriteRoutes");
const discountRatingRoutes = require("./discountRatingRoutes");
const discountRedemptionRoutes = require("./discountRedemptionRoutes");

router.use("/users", userRoutes);
router.use("/roles", userRoleRoutes);
router.use("/discounts", discountRoutes);
router.use("/locations", locationRoutes);
router.use("/categories", discountCategoryRoutes);
router.use("/favorites", userFavoriteRoutes);
router.use("/ratings", discountRatingRoutes);
router.use("/redemptions", discountRedemptionRoutes);

module.exports = router;
