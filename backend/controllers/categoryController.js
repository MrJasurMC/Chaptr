const {
  Category,
  Book
} = require('../models');
const {
  ValidateCategory,
  ValidateCategoryUpdate
} = require('../validation/categoryValidation');
const {
  Op
} = require('sequelize');
exports.createCategory = async (req, res) => {
  const {
    error
  } = ValidateCategory(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const category = await Category.create(req.body);
    res.status(201).send(category);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Book,
        as: 'books'
      }]
    });
    if (!category) return res.status(404).send("Category not found");
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.updateCategory = async (req, res) => {
  const {
    error
  } = ValidateCategoryUpdate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send("Category not found");
    await category.update(req.body);
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send("Category not found");
    const categoryData = category.toJSON();
    await category.destroy();
    res.status(200).send({
      message: "Category deleted successfully",
      data: categoryData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.searchCategories = async (req, res) => {
  try {
    const {
      query
    } = req.query;
    if (!query) {
      return res.status(400).send({
        error: "Search query is required"
      });
    }
    const categories = await Category.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      }
    });
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
