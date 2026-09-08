const {
  Book,
  Category,
  Page
} = require('../models');
const {
  ValidateBook,
  ValidateBookUpdate
} = require('../validation/bookValidation');
const {
  Op
} = require('sequelize');
exports.uploadCover = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      error: "No image file provided"
    });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(200).send({
    url
  });
};
function stripRtf(rtf) {
  return rtf.replace(/\{\\\*?\\[^{}]+\}/g, "").replace(/\\par[d]?/g, "\n").replace(/\\tab/g, "\t").replace(/\\'[0-9a-fA-F]{2}/g, "").replace(/\\[a-zA-Z]+-?\d* ?/g, "").replace(/[{}]/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function splitIntoPages(text, perPage) {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let current = [];
  let currentWords = 0;
  for (const para of paragraphs) {
    const paraWords = para.split(/\s+/).filter(Boolean).length;
    if (currentWords + paraWords > perPage && current.length > 0) {
      chunks.push(current.join("\n\n"));
      current = [];
      currentWords = 0;
    }
    current.push(para);
    currentWords += paraWords;
  }
  if (current.length) chunks.push(current.join("\n\n"));
  return chunks;
}
exports.uploadBookContent = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      error: "No text file provided"
    });
  }
  const bookId = req.body.book_id;
  if (!bookId) {
    return res.status(400).send({
      error: "book_id is required"
    });
  }
  const book = await Book.findByPk(bookId);
  if (!book) return res.status(404).send("Book not found");
  const wordsPerPage = Number(req.body.words_per_page) || 300;
  const name = req.file.originalname.toLowerCase();
  const raw = req.file.buffer.toString("utf-8");
  const isRtf = name.endsWith(".rtf") || raw.trim().startsWith("{\\rtf");
  const text = isRtf ? stripRtf(raw) : raw;
  const chunks = splitIntoPages(text, wordsPerPage);
  if (chunks.length === 0) {
    return res.status(400).send({
      error: "File contained no text to import"
    });
  }
  try {
    const existing = await Page.findAll({
      where: {
        book_id: bookId
      }
    });
    let nextNumber = existing.length ? Math.max(...existing.map(p => p.page_number)) + 1 : 1;
    const created = [];
    for (const chunk of chunks) {
      const page = await Page.create({
        book_id: bookId,
        page_number: nextNumber,
        content: chunk
      });
      created.push(page);
      nextNumber += 1;
    }
    res.status(201).send({
      message: `${created.length} pages imported`,
      pages: created
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.createBook = async (req, res) => {
  const {
    error
  } = ValidateBook(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const book = await Book.create(req.body);
    res.status(201).send(book);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    if (!book) return res.status(404).send("Book not found");
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getBookPages = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    const allPages = await Page.findAll({
      where: {
        book_id: book.id
      },
      order: [['page_number', 'ASC']]
    });
    const freePages = allPages.slice(0, book.free_pages);
    res.status(200).send({
      free_pages: book.free_pages,
      total_pages: allPages.length,
      locked: allPages.length > book.free_pages,
      pages: freePages
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.updateBook = async (req, res) => {
  const {
    error
  } = ValidateBookUpdate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    await book.update(req.body);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    const bookData = book.toJSON();
    await book.destroy();
    res.status(200).send({
      message: "Book deleted successfully",
      data: bookData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.searchBooks = async (req, res) => {
  try {
    const {
      query
    } = req.query;
    if (!query) {
      return res.status(400).send({
        error: "Search query is required"
      });
    }
    const books = await Book.findAll({
      where: {
        [Op.or]: [{
          title: {
            [Op.iLike]: `%${query}%`
          }
        }, {
          author: {
            [Op.iLike]: `%${query}%`
          }
        }]
      },
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
