module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    cover_image: {
      type: DataTypes.STRING
    },
    total_pages: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    free_pages: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });
  Book.associate = models => {
    Book.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category"
    });
    Book.hasMany(models.Page, {
      foreignKey: "book_id",
      as: "pages"
    });
  };
  return Book;
};
