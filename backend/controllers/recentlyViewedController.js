const {
  RecentlyViewed,
  Book,
  Category
} = require('../models');
const {
  ValidateRecentlyViewed
} = require('../validation/recentlyViewedValidation');
exports.recordView = async (req, res) => {
  const {
    error
  } = ValidateRecentlyViewed(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const [entry] = await RecentlyViewed.findOrCreate({
      where: {
        user_id: req.body.user_id,
        book_id: req.body.book_id
      },
      defaults: {
        viewed_at: new Date()
      }
    });
    entry.viewed_at = new Date();
    await entry.save();
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getRecentlyViewed = async (req, res) => {
  try {
    const entries = await RecentlyViewed.findAll({
      include: [{
        model: Book,
        as: 'book',
        include: [{
          model: Category,
          as: 'category'
        }]
      }]
    });
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getRecentlyViewedByUser = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const entries = await RecentlyViewed.findAll({
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
      order: [['viewed_at', 'DESC']],
      limit
    });
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getRecentlyViewedById = async (req, res) => {
  try {
    const entry = await RecentlyViewed.findByPk(req.params.id);
    if (!entry) return res.status(404).send("Entry not found");
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.deleteRecentlyViewed = async (req, res) => {
  try {
    const entry = await RecentlyViewed.findByPk(req.params.id);
    if (!entry) return res.status(404).send("Entry not found");
    const entryData = entry.toJSON();
    await entry.destroy();
    res.status(200).send({
      message: "Entry deleted successfully",
      data: entryData
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.clearRecentlyViewedForUser = async (req, res) => {
  try {
    const count = await RecentlyViewed.destroy({
      where: {
        user_id: req.params.userId
      }
    });
    res.status(200).send({
      message: "History cleared",
      deleted: count
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
