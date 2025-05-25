const express = require("express");
const router = express.Router();
const discountRedemptionController = require("../controllers/discountRedemptionController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /redemptions/users/{userId}:
 * get:
 * summary: Pobierz historię odebranych zniżek dla użytkownika
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: integer
 * description: ID użytkownika
 * responses:
 * 200:
 * description: Lista odebranych zniżek użytkownika
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * redemption_id:
 * type: integer
 * example: 1
 * user_id:
 * type: integer
 * example: 1
 * discount_id:
 * type: integer
 * example: 2
 * redeemed_at:
 * type: string
 * format: date-time
 * example: "2025-04-20T14:38:06.000Z"
 */
router.get(
  "/users/:userId",
  authMiddleware,
  discountRedemptionController.getRedemptionsByUser
);

/**
 * @swagger
 * /redemptions/status/users/{userId}/discounts/{discountId}:
 * get:
 * summary: Sprawdź status odebrania konkretnej zniżki przez użytkownika
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: integer
 * description: ID użytkownika
 * - in: path
 * name: discountId
 * required: true
 * schema:
 * type: integer
 * description: ID zniżki
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Status odebrania zniżki
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * redeemed:
 * type: boolean
 * example: true
 * redeemed_at:
 * type: string
 * format: date-time
 * example: "2025-04-20T14:38:06.000Z"
 * 401:
 * description: Nieautoryzowany
 * 404:
 * description: Zniżka lub użytkownik nie znaleziony (lub nie odebrano)
 */
router.get(
  "/status/users/:userId/discounts/:discountId", // Nowy endpoint
  authMiddleware,
  discountRedemptionController.getRedemptionStatus
);

/**
 * @swagger
 * /redemptions:
 * post:
 * summary: Dodaj nową historię odebrania zniżki
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * user_id:
 * type: integer
 * example: 1
 * discount_id:
 * type: integer
 * example: 2
 * responses:
 * 201:
 * description: Historia odebrania zniżki została dodana pomyślnie
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * redemption_id:
 * type: integer
 * example: 1
 * user_id:
 * type: integer
 * example: 1
 * discount_id:
 * type: integer
 * example: 2
 * redeemed_at:
 * type: string
 * format: date-time
 * example: "2025-04-20T14:38:06.000Z"
 * 400:
 * description: Nieprawidłowe dane wejściowe
 */
router.post("/", authMiddleware, discountRedemptionController.addRedemption);

module.exports = router;
