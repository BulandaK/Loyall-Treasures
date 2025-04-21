const express = require("express");
const router = express.Router();
const userFavoriteController = require("../controllers/userFavoriteController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /favorites/users/{userId}:
 *   get:
 *     summary: Pobierz ulubione zniżki użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista ulubionych zniżek użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   favorite_id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   discount_id:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-20T14:38:06.000Z"
 */
router.get(
  "/users/:userId",
  authMiddleware,
  userFavoriteController.getFavoritesByUser
);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Dodaj zniżkę do ulubionych
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
 *                 example: 1
 *     responses:
 *       201:
 *         description: Zniżka dodana do ulubionych
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorite_id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 discount_id:
 *                   type: integer
 *                   example: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-20T14:38:06.000Z"
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post("/", authMiddleware, userFavoriteController.addFavorite);

/**
 * @swagger
 * /favorites/users/{userId}/{discountId}:
 *   delete:
 *     summary: Usuń zniżkę z ulubionych użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *       - in: path
 *         name: discountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zniżki
 *     responses:
 *       200:
 *         description: Zniżka usunięta z ulubionych
 *       404:
 *         description: Ulubiona zniżka nie znaleziona
 */
router.delete(
  "/users/:userId/:discountId",
  authMiddleware,
  userFavoriteController.removeFavorite
);

module.exports = router;
