const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, requireAdmin, requireSelfOrAdmin } = require("../middleware/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and auth
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", authMiddleware, requireAdmin, userController.getUsers);
/**
 * @swagger
 * /api/users/search:
 *   get:
 *     tags: [Users]
 *     summary: Search users by name or email
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Matching users
 */
router.get("/users/search", authMiddleware, requireAdmin, userController.searchUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/users/:id", authMiddleware, requireSelfOrAdmin(), userController.getUserById);
/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input or email already registered
 */
router.post("/users", userController.createUser);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/users/login", userController.loginUser);
/**
 * @swagger
 * /api/users/google:
 *   post:
 *     tags: [Users]
 *     summary: Log in or register with a Google ID token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 description: The ID token returned by Google's Sign-In button
 *     responses:
 *       200:
 *         description: Login successful (account created automatically if new)
 *       400:
 *         description: Missing or invalid credential
 *       401:
 *         description: Google credential failed verification
 */
router.post("/users/google", userController.googleAuth);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 */
router.put("/users/:id", authMiddleware, requireSelfOrAdmin(), userController.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/users/:id", authMiddleware, requireSelfOrAdmin(), userController.deleteUser);
module.exports = router;
