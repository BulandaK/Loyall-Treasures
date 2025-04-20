const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Pobierz wszystkie lokalizacje
 *     responses:
 *       200:
 *         description: Lista lokalizacji
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   location_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Warsaw
 *                   address:
 *                     type: string
 *                     example: "123 Main Street"
 */
router.get("/", locationController.getAllLocations);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Pobierz lokalizację po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID lokalizacji
 *     responses:
 *       200:
 *         description: Szczegóły lokalizacji
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Warsaw
 *                 address:
 *                   type: string
 *                   example: "123 Main Street"
 *       404:
 *         description: Lokalizacja nie znaleziona
 */
router.get("/:id", locationController.getLocationById);

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Dodaj nową lokalizację
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Warsaw
 *               address:
 *                 type: string
 *                 example: "123 Main Street"
 *     responses:
 *       201:
 *         description: Lokalizacja dodana pomyślnie
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 */
router.post("/", locationController.createLocation);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Zaktualizuj lokalizację
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID lokalizacji
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Location
 *               address:
 *                 type: string
 *                 example: "456 Updated Street"
 *     responses:
 *       200:
 *         description: Lokalizacja zaktualizowana pomyślnie
 *       404:
 *         description: Lokalizacja nie znaleziona
 */
router.put("/:id", locationController.updateLocation);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Usuń lokalizację
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID lokalizacji
 *     responses:
 *       200:
 *         description: Lokalizacja usunięta pomyślnie
 *       404:
 *         description: Lokalizacja nie znaleziona
 */
router.delete("/:id", locationController.deleteLocation);

module.exports = router;
