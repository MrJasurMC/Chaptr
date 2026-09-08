const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Book page content (admin managed)
 */
/**
 * @swagger
 * /api/pages:
 *   get:
 *     tags: [Pages]
 *     summary: Get all pages (admin)
 *     responses:
 *       200:
 *         description: List of pages
 */
router.get("/pages", pageController.getPages);
/**
 * @swagger
 * /api/pages/book/{bookId}:
 *   get:
 *     tags: [Pages]
 *     summary: Get all pages for one book, in order
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pages for the book
 */
router.get("/pages/book/:bookId", pageController.getPagesByBook);
/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     tags: [Pages]
 *     summary: Get page by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Page details
 */
router.get("/pages/:id", pageController.getPageById);
/**
 * @swagger
 * /api/pages:
 *   post:
 *     tags: [Pages]
 *     summary: Add a page to a book (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [book_id, page_number, content]
 *             properties:
 *               book_id:
 *                 type: integer
 *                 example: 1
 *               page_number:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "Once upon a time..."
 *     responses:
 *       201:
 *         description: Page created
 */
router.post("/pages", pageController.createPage);
/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     tags: [Pages]
 *     summary: Update page by ID (admin)
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
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               pageNumber:
 *                 type: integer
 *                 example: 2
 *               content:
 *                 type: string
 *                 example: "The adventure continues..."
 *     responses:
 *       200:
 *         description: Page updated
 */
router.put("/pages/:id", pageController.updatePage);
/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     tags: [Pages]
 *     summary: Delete page by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Page deleted
 */
router.delete("/pages/:id", pageController.deletePage);
module.exports = router;
