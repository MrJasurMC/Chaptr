module.exports = (sequelize, DataTypes) => {
  const RecentlyViewed = sequelize.define('RecentlyViewed', {
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
    viewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [{
      unique: true,
      fields: ["user_id", "book_id"]
    }]
  });
  RecentlyViewed.associate = models => {
    RecentlyViewed.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
    RecentlyViewed.belongsTo(models.Book, {
      foreignKey: "book_id",
      as: "book"
    });
  };
  return RecentlyViewed;
};
