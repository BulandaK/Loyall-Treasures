const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: locations
 *     description: Zarządzanie lokalizacjami
 */

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Pobierz wszystkie lokalizacje
 *     tags: [locations]
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
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  locationController.getAllLocations
);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Pobierz lokalizację po ID
 *     tags: [locations]
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
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  locationController.getLocationById
);

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Dodaj nową lokalizację
 *     tags: [locations]
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
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  locationController.createLocation
);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Zaktualizuj lokalizację
 *     tags: [locations]
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
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  locationController.updateLocation
);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Usuń lokalizację
 *     tags: [locations]
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
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  locationController.deleteLocation
);

module.exports = router;
