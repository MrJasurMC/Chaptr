const {
  Page,
  Book
} = require('../models');
const {
  ValidatePage,
  ValidatePageUpdate
} = require('../validation/pageValidation');
exports.createPage = async (req, res) => {
  const {
    error
  } = ValidatePage(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const page = await Page.create(req.body);
    res.status(201).send(page);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      include: [{
        model: Book,
        as: 'book'
      }]
    });
    res.status(200).send(pages);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getPagesByBook = async (req, res) => {
  try {
    const pages = await Page.findAll({
      where: {
        book_id: req.params.bookId
      },
      order: [['page_number', 'ASC']]
    });
    res.status(200).send(pages);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return res.status(404).send("Page not found");
    res.status(200).send(page);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.updatePage = async (req, res) => {
  const {
    error
  } = ValidatePageUpdate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return res.status(404).send("Page not found");
    await page.update(req.body);
    res.status(200).send(page);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return res.status(404).send("Page not found");
    const pageData = page.toJSON();
    await page.destroy();
    res.status(200).send({
      message: "Page deleted successfully",
      data: pageData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
