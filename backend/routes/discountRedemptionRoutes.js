const express = require("express");
const router = express.Router();
const discountRedemptionController = require("../controllers/discountRedemptionController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /redemptions/users/{userId}:
 *   get:
 *     summary: Pobierz historię odebranych zniżek dla użytkownika
 *     tags: [Discount Redemptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID użytkownika
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
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
 *                   location_id:
 *                     type: integer
 *                     example: 1
 *                   used_code:
 *                     type: string
 *                     nullable: true
 *                     example: "SUMMER2024"
 *                   is_used:
 *                     type: boolean
 *                     example: true
 *                   redeemed_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-20T14:38:06.000Z"
 *                   discount:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Super Zniżka"
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Restauracja XYZ"
 *       '401':
 *         description: Nieautoryzowany
 *       '500':
 *         description: Błąd serwera
 */
router.get(
  "/users/:userId",
  authMiddleware, // Dodano middleware autoryzacji
  discountRedemptionController.getRedemptionsByUser
);

/**
 * @swagger
 * /redemptions/status/users/{userId}/discounts/{discountId}:
 *   get:
 *     summary: Sprawdź status odebrania konkretnej zniżki przez użytkownika
 *     tags: [Discount Redemptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID użytkownika
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: discountId
 *         in: path
 *         required: true
 *         description: ID zniżki
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Status odebrania zniżki
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redeemed:
 *                   type: boolean
 *                   example: true
 *                 redeemed_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2025-04-20T14:38:06.000Z"
 *       '401':
 *         description: Nieautoryzowany
 *       '500':
 *         description: Błąd serwera
 */
router.get(
  "/status/users/:userId/discounts/:discountId",
  authMiddleware,
  discountRedemptionController.getRedemptionStatus
);

/**
 * @swagger
 * /redemptions:
 *   post:
 *     summary: Dodaj nową historię odebrania zniżki (odbierz zniżkę)
 *     tags: [Discount Redemptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - discount_id
 *               - location_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID użytkownika odbierającego zniżkę
 *                 example: 1
 *               discount_id:
 *                 type: integer
 *                 description: ID odbieranej zniżki
 *                 example: 2
 *               location_id:
 *                 type: integer
 *                 description: ID lokalizacji, w której zniżka jest odbierana
 *                 example: 1
 *               used_code:
 *                 type: string
 *                 nullable: true
 *                 description: Użyty kod promocyjny (jeśli dotyczy)
 *                 example: "PROMO123"
 *     responses:
 *       '201':
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
 *                 location_id:
 *                   type: integer
 *                   example: 1
 *                 used_code:
 *                   type: string
 *                   nullable: true
 *                 is_used:
 *                   type: boolean
 *                   example: true
 *                 redeemed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-20T14:38:06.000Z"
 *       '400':
 *         description: Nieprawidłowe dane wejściowe lub zniżka już odebrana
 *       '401':
 *         description: Nieautoryzowany
 *       '500':
 *         description: Błąd serwera
 */
router.post(
  "/",
  authMiddleware, // Dodano middleware autoryzacji
  discountRedemptionController.addRedemption
);

module.exports = router;
