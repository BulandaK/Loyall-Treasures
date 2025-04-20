const express = require("express");
const router = express.Router();
const discountRedemptionController = require("../controllers/discountRedemptionController");

/**
 * @swagger
 * /redemptions/users/{userId}:
 *   get:
 *     summary: Pobierz historię odebranych zniżek dla użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista odebranych zniżek użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   redemption_id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   discount_id:
 *                     type: integer
 *                     example: 2
 *                   redeemed_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-20T14:38:06.000Z"
 */
router.get("/users/:userId", discountRedemptionController.getRedemptionsByUser);

/**
 * @swagger
 * /redemptions:
 *   post:
 *     summary: Dodaj nową historię odebrania zniżki
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               discount_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Historia odebrania zniżki została dodana pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redemption_id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 discount_id:
 *                   type: integer
 *                   example: 2
 *                 redeemed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-20T14:38:06.000Z"
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post("/", discountRedemptionController.addRedemption);

module.exports = router;
