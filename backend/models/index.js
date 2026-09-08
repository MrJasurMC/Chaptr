const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model")(sequelize, Sequelize);
const Category = require("./category.model")(sequelize, Sequelize);
const Book = require("./book.model")(sequelize, Sequelize);
const Page = require("./page.model")(sequelize, Sequelize);
const Favorite = require("./favorite.model")(sequelize, Sequelize);
const RecentlyViewed = require("./recentlyViewed.model")(sequelize, Sequelize);
const Review = require("./review.model")(sequelize, Sequelize);
User.associate(sequelize.models);
Category.associate(sequelize.models);
Book.associate(sequelize.models);
Page.associate(sequelize.models);
Favorite.associate(sequelize.models);
RecentlyViewed.associate(sequelize.models);
Review.associate(sequelize.models);
module.exports = {
  sequelize,
  User,
  Category,
  Book,
  Page,
  Favorite,
  RecentlyViewed,
  Review
};
