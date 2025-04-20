const express = require("express");
const router = express.Router();
const discountRatingController = require("../controllers/discountRatingController");

/**
 * @swagger
 * /ratings/discounts/{discountId}:
 *   get:
 *     summary: Pobierz oceny dla zniżki
 *     parameters:
 *       - in: path
 *         name: discountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zniżki
 *     responses:
 *       200:
 *         description: Lista ocen dla zniżki
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rating_id:
 *                     type: integer
 *                     example: 1
 *                   discount_id:
 *                     type: integer
 *                     example: 2
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   rating:
 *                     type: integer
 *                     example: 5
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-20T14:38:06.000Z"
 */
router.get(
  "/discounts/:discountId",
  discountRatingController.getRatingsByDiscount
);

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Dodaj ocenę dla zniżki
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount_id:
 *                 type: integer
 *                 example: 2
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Ocena dodana pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating_id:
 *                   type: integer
 *                   example: 1
 *                 discount_id:
 *                   type: integer
 *                   example: 2
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-20T14:38:06.000Z"
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post("/", discountRatingController.addRating);

/**
 * @swagger
 * /ratings/{id}:
 *   delete:
 *     summary: Usuń ocenę
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID oceny
 *     responses:
 *       200:
 *         description: Ocena usunięta pomyślnie
 *       404:
 *         description: Ocena nie znaleziona
 */
router.delete("/:id", discountRatingController.deleteRating);

module.exports = router;
