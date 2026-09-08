module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
  Page.associate = models => {
    Page.belongsTo(models.Book, {
      foreignKey: "book_id",
      as: "book"
    });
  };
  return Page;
};
