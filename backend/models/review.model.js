module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT
    }
  }, {
    indexes: [{
      unique: true,
      fields: ["user_id", "book_id"]
    }]
  });
  Review.associate = models => {
    Review.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
    Review.belongsTo(models.Book, {
      foreignKey: "book_id",
      as: "book"
    });
  };
  return Review;
};
