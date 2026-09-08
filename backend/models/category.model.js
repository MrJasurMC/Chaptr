module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    }
  });
  Category.associate = models => {
    Category.hasMany(models.Book, {
      foreignKey: "category_id",
      as: "books"
    });
  };
  return Category;
};
