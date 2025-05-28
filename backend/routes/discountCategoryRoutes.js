const express = require("express");
const router = express.Router();
const discountCategoryController = require("../controllers/discountCategoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Discount Categories
 *     description: Zarządzanie kategoriami zniżek
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Pobierz wszystkie kategorie zniżek
 *     tags: [Discount Categories]
 *     responses:
 *       200:
 *         description: Lista kategorii zniżek
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Electronics
 */
router.get("/", discountCategoryController.getAllCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Utwórz nową kategorię zniżek
 *     tags: [Discount Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Kategoria utworzona pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Electronics
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  discountCategoryController.createCategory
);

module.exports = router;
