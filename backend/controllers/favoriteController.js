const {
  Favorite,
  Book,
  Category
} = require('../models');
const {
  ValidateFavorite
} = require('../validation/favoriteValidation');
exports.addFavorite = async (req, res) => {
  const {
    error
  } = ValidateFavorite(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const existing = await Favorite.findOne({
      where: {
        user_id: req.body.user_id,
        book_id: req.body.book_id
      }
    });
    if (existing) return res.status(200).send(existing);
    const favorite = await Favorite.create(req.body);
    res.status(201).send(favorite);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      include: [{
        model: Book,
        as: 'book',
        include: [{
          model: Category,
          as: 'category'
        }]
      }]
    });
    res.status(200).send(favorites);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: {
        user_id: req.params.userId
      },
      include: [{
        model: Book,
        as: 'book',
        include: [{
          model: Category,
          as: 'category'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).send(favorites);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getFavoriteById = async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id);
    if (!favorite) return res.status(404).send("Favorite not found");
    res.status(200).send(favorite);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id);
    if (!favorite) return res.status(404).send("Favorite not found");
    const favoriteData = favorite.toJSON();
    await favorite.destroy();
    res.status(200).send({
      message: "Favorite removed successfully",
      data: favoriteData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.removeFavoriteByUserAndBook = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        user_id: req.params.userId,
        book_id: req.params.bookId
      }
    });
    if (!favorite) return res.status(404).send("Favorite not found");
    const favoriteData = favorite.toJSON();
    await favorite.destroy();
    res.status(200).send({
      message: "Favorite removed successfully",
      data: favoriteData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
