const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorite books
 */
/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get all favorites (admin)
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get("/favorites", favoriteController.getFavorites);
/**
 * @swagger
 * /api/favorites/user/{userId}:
 *   get:
 *     tags: [Favorites]
 *     summary: Get a user's favorite books
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: User's favorites
 */
router.get("/favorites/user/:userId", favoriteController.getFavoritesByUser);
/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     tags: [Favorites]
 *     summary: Get favorite by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite details
 */
router.get("/favorites/:id", favoriteController.getFavoriteById);
/**
 * @swagger
 * /api/favorites:
 *   post:
 *     tags: [Favorites]
 *     summary: Add a book to favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, book_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Favorite added
 *       400:
 *         description: Invalid input
 */
router.post("/favorites", favoriteController.addFavorite);
/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove favorite by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite removed
 */
router.delete("/favorites/:id", favoriteController.removeFavorite);
/**
 * @swagger
 * /api/favorites/user/{userId}/book/{bookId}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove favorite by user and book (for toggle buttons)
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite removed
 */
router.delete("/favorites/user/:userId/book/:bookId", favoriteController.removeFavoriteByUserAndBook);
module.exports = router;
