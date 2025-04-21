const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Pobierz wszystkie zniżki
 *     responses:
 *       200:
 *         description: Lista zniżek
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   discount_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Discount 1"
 *                   description:
 *                     type: string
 *                     example: "Description of discount"
 *                   normal_price:
 *                     type: number
 *                     format: float
 *                     example: 100.0
 *                   discount_price:
 *                     type: number
 *                     format: float
 *                     example: 80.0
 *                   percentage_discount:
 *                     type: integer
 *                     example: 20
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     example: "2025-04-01"
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: "2025-04-30"
 *                   is_active:
 *                     type: boolean
 *                     example: true
 */
router.get("/", discountController.getAllDiscounts);

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Pobierz zniżkę po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zniżki
 *     responses:
 *       200:
 *         description: Szczegóły zniżki
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discount_id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Discount 1"
 *                 description:
 *                   type: string
 *                   example: "Description of discount"
 *                 normal_price:
 *                   type: number
 *                   format: float
 *                   example: 100.0
 *                 discount_price:
 *                   type: number
 *                   format: float
 *                   example: 80.0
 *                 percentage_discount:
 *                   type: integer
 *                   example: 20
 *                 start_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-04-01"
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-04-30"
 *                 is_active:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Zniżka nie znaleziona
 */
router.get("/:id", discountController.getDiscountById);

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Utwórz nową zniżkę
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Discount 1"
 *               description:
 *                 type: string
 *                 example: "Description of discount"
 *               normal_price:
 *                 type: number
 *                 format: float
 *                 example: 100.0
 *               discount_price:
 *                 type: number
 *                 format: float
 *                 example: 80.0
 *               percentage_discount:
 *                 type: integer
 *                 example: 20
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-30"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Zniżka utworzona pomyślnie
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  discountController.createDiscount
);

/**
 * @swagger
 * /discounts/{id}:
 *   put:
 *     summary: Zaktualizuj zniżkę
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zniżki
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Discount"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               normal_price:
 *                 type: number
 *                 format: float
 *                 example: 120.0
 *               discount_price:
 *                 type: number
 *                 format: float
 *                 example: 90.0
 *               percentage_discount:
 *                 type: integer
 *                 example: 25
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-31"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Zniżka zaktualizowana pomyślnie
 *       404:
 *         description: Zniżka nie znaleziona
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  discountController.updateDiscount
);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Usuń zniżkę
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zniżki
 *     responses:
 *       200:
 *         description: Zniżka usunięta pomyślnie
 *       404:
 *         description: Zniżka nie znaleziona
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  discountController.deleteDiscount
);

module.exports = router;
