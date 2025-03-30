const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");

router.get("/", discountController.getAllDiscounts);
router.get("/:id", discountController.getDiscountById);
router.post("/", discountController.createDiscount); // Upewnij się, że metoda istnieje
router.put("/:id", discountController.updateDiscount);
router.delete("/:id", discountController.deleteDiscount);

module.exports = router;
