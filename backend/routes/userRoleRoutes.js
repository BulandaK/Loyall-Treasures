const express = require("express");
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");

router.get("/", userRoleController.getAllRoles);
router.post("/", userRoleController.createRole);

module.exports = router;
