const {
  Review,
  Book,
  User
} = require('../models');
const {
  ValidateReview,
  ValidateReviewUpdate
} = require('../validation/reviewValidation');
exports.createReview = async (req, res) => {
  const {
    error
  } = ValidateReview(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const existing = await Review.findOne({
      where: {
        user_id: req.body.user_id,
        book_id: req.body.book_id
      }
    });
    if (existing) {
      return res.status(409).send({
        error: "User already reviewed this book. Use update instead."
      });
    }
    const review = await Review.create(req.body);
    res.status(201).send(review);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [{
        model: Book,
        as: 'book'
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        book_id: req.params.bookId
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        user_id: req.params.userId
      },
      include: [{
        model: Book,
        as: 'book'
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [{
        model: Book,
        as: 'book'
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });
    if (!review) return res.status(404).send("Review not found");
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.updateReview = async (req, res) => {
  const {
    error
  } = ValidateReviewUpdate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).send("Review not found");
    await review.update(req.body);
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).send("Review not found");
    const reviewData = review.toJSON();
    await review.destroy();
    res.status(200).send({
      message: "Review deleted successfully",
      data: reviewData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
