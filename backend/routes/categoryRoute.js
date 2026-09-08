const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Book categories
 */
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/categories", categoryController.getCategories);
/**
 * @swagger
 * /api/categories/search:
 *   get:
 *     tags: [Categories]
 *     summary: Search categories by name
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Matching categories
 */
router.get("/categories/search", categoryController.searchCategories);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID, with its books
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/categories/:id", categoryController.getCategoryById);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a category (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid input
 */
router.post("/categories", authMiddleware, requireAdmin, categoryController.createCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category by ID (admin)
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 */
router.put("/categories/:id", authMiddleware, requireAdmin, categoryController.updateCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/categories/:id", authMiddleware, requireAdmin, categoryController.deleteCategory);
module.exports = router;
