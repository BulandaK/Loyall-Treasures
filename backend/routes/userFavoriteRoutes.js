// backend/routes/userFavoriteRoutes.js
const express = require("express");
const router = express.Router();
const userFavoriteController = require("../controllers/userFavoriteController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: User Favorites
 *   description: Zarządzanie ulubionymi zniżkami użytkowników
 */

/**
 * @swagger
 * /favorites/users/{userId}:
 *   get:
 *     summary: Pobierz ulubione zniżki użytkownika
 *     tags: [User Favorites]
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
 *                   added_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-20T14:38:06.000Z"
 *                   discount:
 *                     type: object
 *                     properties:
 *                       discount_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       '401':
 *         description: Nieautoryzowany
 *       '403':
 *         description: Zabroniony dostęp
 *       '404':
 *         description: Użytkownik nie znaleziony
 *       '500':
 *         description: Błąd serwera
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
 *     tags: [User Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - discount_id
 *             properties:
 *               discount_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID zniżki do dodania do ulubionych
 *     responses:
 *       '201':
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
 *                 added_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-20T14:38:06.000Z"
 *       '400':
 *         description: Nieprawidłowe dane wejściowe (np. brak discount_id)
 *       '401':
 *         description: Nieautoryzowany
 *       '404':
 *         description: Zniżka o podanym ID nie istnieje
 *       '409':
 *         description: Zniżka już jest w ulubionych
 *       '500':
 *         description: Błąd serwera
 */
router.post("/", authMiddleware, userFavoriteController.addFavorite);

/**
 * @swagger
 * /favorites/users/{userId}/{discountId}:
 *   delete:
 *     summary: Usuń zniżkę z ulubionych użytkownika
 *     tags: [User Favorites]
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
 *         description: ID zniżki do usunięcia
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Zniżka usunięta z ulubionych
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Favorite removed successfully
 *       '400':
 *         description: Nieprawidłowe ID użytkownika lub zniżki
 *       '401':
 *         description: Nieautoryzowany
 *       '403':
 *         description: Zabroniony dostęp (próba usunięcia ulubionych innego użytkownika)
 *       '404':
 *         description: Ulubiona zniżka nie została znaleziona
 *       '500':
 *         description: Błąd serwera
 */
router.delete(
  "/users/:userId/:discountId",
  authMiddleware,
  userFavoriteController.removeFavorite
);

module.exports = router;
