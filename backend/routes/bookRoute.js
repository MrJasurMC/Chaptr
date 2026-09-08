const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../config/upload");
const {
  uploadBookText
} = require("../config/upload");
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book catalog
 */
/**
 * @swagger
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 */
router.get("/books", bookController.getBooks);
/**
 * @swagger
 * /api/books/search:
 *   get:
 *     tags: [Books]
 *     summary: Search books by title or author
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Matching books
 */
router.get("/books/search", bookController.searchBooks);
/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get("/books/:id", bookController.getBookById);
/**
 * @swagger
 * /api/books/{id}/pages:
 *   get:
 *     tags: [Books]
 *     summary: Get readable pages for a book (free preview, or full text if purchased)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pages the current user is allowed to read
 *       404:
 *         description: Book not found
 */
router.get("/books/:id/pages", bookController.getBookPages);
/**
 * @swagger
 * /api/books/upload-cover:
 *   post:
 *     tags: [Books]
 *     summary: Upload a cover image, returns the file's public URL
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cover
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Uploaded file URL
 *       400:
 *         description: No file provided or invalid file type
 */
router.post("/books/upload-cover", authMiddleware, requireAdmin, upload.single("cover"), bookController.uploadCover);
/**
 * @swagger
 * /api/books/upload-content:
 *   post:
 *     tags: [Books]
 *     summary: Upload a .txt or .rtf file and auto-split it into pages for a book
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - book_id
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               book_id:
 *                 type: integer
 *               words_per_page:
 *                 type: integer
 *                 description: Optional, defaults to 300
 *     responses:
 *       201:
 *         description: Pages imported
 *       400:
 *         description: No file provided or missing book_id
 *       404:
 *         description: Book not found
 */
router.post("/books/upload-content", authMiddleware, requireAdmin, uploadBookText.single("file"), bookController.uploadBookContent);
/**
 * @swagger
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Create a book (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, title, author, price]
 *             properties:
 *               category_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               total_pages:
 *                 type: integer
 *               free_pages:
 *                 type: integer
 *                 description: Defaults to 2
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Invalid input
 */
router.post("/books", authMiddleware, requireAdmin, bookController.createBook);
/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update book by ID (admin)
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
 *               category_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               total_pages:
 *                 type: integer
 *               free_pages:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Book not found
 */
router.put("/books/:id", authMiddleware, requireAdmin, bookController.updateBook);
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete("/books/:id", authMiddleware, requireAdmin, bookController.deleteBook);
module.exports = router;
