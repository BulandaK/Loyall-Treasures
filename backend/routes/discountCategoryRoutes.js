const express = require("express");
const router = express.Router();
const discountCategoryController = require("../controllers/discountCategoryController");

router.get("/", discountCategoryController.getAllCategories);
router.post("/", discountCategoryController.createCategory);

module.exports = router;
