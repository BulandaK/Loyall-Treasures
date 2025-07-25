const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Zarządzanie użytkownikami
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobierz wszystkich użytkowników
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista użytkowników
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 */
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Pobierz użytkownika po ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Szczegóły użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       404:
 *         description: Użytkownik nie znaleziony
 */
router.get("/:id", authMiddleware, adminMiddleware, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Utwórz nowego użytkownika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               role_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Użytkownik utworzony pomyślnie
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *       422:
 *         description: Email musi być unikalny
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Zaloguj użytkownika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Zalogowano pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Nieprawidłowy email lub hasło
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Zaktualizuj dane użytkownika
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: Użytkownik zaktualizowany pomyślnie
 *       404:
 *         description: Użytkownik nie znaleziony
 */
router.put("/:id", authMiddleware, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Usuń użytkownika
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Użytkownik usunięty pomyślnie
 *       404:
 *         description: Użytkownik nie znaleziony
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
