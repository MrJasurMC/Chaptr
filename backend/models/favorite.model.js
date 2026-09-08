module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
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
    }
  }, {
    indexes: [{
      unique: true,
      fields: ["user_id", "book_id"]
    }]
  });
  Favorite.associate = models => {
    Favorite.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
    Favorite.belongsTo(models.Book, {
      foreignKey: "book_id",
      as: "book"
    });
  };
  return Favorite;
};
