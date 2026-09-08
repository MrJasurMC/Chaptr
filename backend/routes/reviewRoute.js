const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: User ratings and comments on books
 */
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews (admin)
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/reviews", reviewController.getReviews);
/**
 * @swagger
 * /api/reviews/book/{bookId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews for a book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Reviews for the book
 */
router.get("/reviews/book/:bookId", reviewController.getReviewsByBook);
/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews written by a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer  
 *         required: true
 *     responses:
 *       200:
 *         description: User's reviews
 */
router.get("/reviews/user/:userId", reviewController.getReviewsByUser);
/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Review details
 */
router.get("/reviews/:id", reviewController.getReviewById);
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review (one per user per book)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *               - rating
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               book_id:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great book!
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/reviews", reviewController.createReview);
/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review's rating/comment
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Updated review
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put("/reviews/:id", reviewController.updateReview);
/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete("/reviews/:id", reviewController.deleteReview);
module.exports = router;
