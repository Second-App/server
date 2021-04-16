"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.User, { through: "Carts", foreignKey: "ProductId" });
      Product.belongsToMany(models.User, { through: "Whistlists", foreignKey: "ProductId" });
      Product.belongsToMany(models.User, { through: "Deals", foreignKey: "ProductId" });
      Product.belongsTo(models.User);
      Product.belongsTo(models.Category);
      Product.belongsTo(models.Type);
    }
  }
  Product.init(
    {
      UserId: DataTypes.INTEGER,
      TypeId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      location: DataTypes.STRING,
      sold: DataTypes.BOOLEAN,
      available: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
