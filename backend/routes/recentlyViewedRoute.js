const express = require("express");
const router = express.Router();
const recentlyViewedController = require("../controllers/recentlyViewedController");
/**
 * @swagger
 * tags:
 *   name: RecentlyViewed
 *   description: Per-user recently viewed books
 */
/**
 * @swagger
 * /api/recently-viewed:
 *   get:
 *     tags: [RecentlyViewed]
 *     summary: Get all recently-viewed entries (admin)
 *     responses:
 *       200:
 *         description: List of entries
 */
router.get("/recently-viewed", recentlyViewedController.getRecentlyViewed);
/**
 * @swagger
 * /api/recently-viewed/user/{userId}:
 *   get:
 *     tags: [RecentlyViewed]
 *     summary: Get a user's recently viewed books, most recent first
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of entries to return
 *     responses:
 *       200:
 *         description: User's recently viewed books
 */
router.get("/recently-viewed/user/:userId", recentlyViewedController.getRecentlyViewedByUser);
/**
 * @swagger
 * /api/recently-viewed/{id}:
 *   get:
 *     tags: [RecentlyViewed]
 *     summary: Get entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Entry details
 */
router.get("/recently-viewed/:id", recentlyViewedController.getRecentlyViewedById);
/**
 * @swagger
 * /api/recently-viewed:
 *   post:
 *     tags: [RecentlyViewed]
 *     summary: Record a book view (upserts viewed_at)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user viewing the book
 *                 example: 1
 *               book_id:
 *                 type: integer
 *                 description: ID of the viewed book
 *                 example: 42
 *     responses:
 *       200:
 *         description: View recorded
 */
router.post("/recently-viewed", recentlyViewedController.recordView);
/**
 * @swagger
 * /api/recently-viewed/{id}:
 *   delete:
 *     tags: [RecentlyViewed]
 *     summary: Delete one entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Entry deleted
 */
router.delete("/recently-viewed/:id", recentlyViewedController.deleteRecentlyViewed);
/**
 * @swagger
 * /api/recently-viewed/user/{userId}:
 *   delete:
 *     tags: [RecentlyViewed]
 *     summary: Clear all history for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: History cleared
 */
router.delete("/recently-viewed/user/:userId", recentlyViewedController.clearRecentlyViewedForUser);
module.exports = router;
