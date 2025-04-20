const express = require("express");
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Pobierz wszystkie role użytkowników
 *     responses:
 *       200:
 *         description: Lista ról użytkowników
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   role_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Admin
 */
router.get("/", userRoleController.getAllRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Utwórz nową rolę użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Moderator
 *     responses:
 *       201:
 *         description: Rola utworzona pomyślnie
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post("/", userRoleController.createRole);

module.exports = router;
