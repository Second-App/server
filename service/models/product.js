/** @format */

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.User, {
        through: 'Communities',
        foreignKey: 'ProductId',
      });
      Product.belongsToMany(models.User, {
        through: 'Carts',
        foreignKey: 'ProductId',
      });
      Product.belongsToMany(models.User, {
        through: 'Whistlists',
        foreignKey: 'ProductId',
      });
      Product.belongsToMany(models.User, {
        through: 'Deals',
        foreignKey: 'ProductId',
      });
      Product.belongsToMany(models.User, {
        through: 'Auctions',
        foreignKey: 'ProductId',
      });
      Product.belongsTo(models.User);
      Product.belongsTo(models.Category);
      Product.belongsTo(models.Type);
    }
  }
  Product.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            args: true,
            msg: 'UserId should not be empty',
          },
          isInt: {
            args: true,
            msg: 'UserId should be a number integer value',
          },
        },
      },
      TypeId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            args: true,
            msg: 'TypeId should not be empty',
          },
          isInt: {
            args: true,
            msg: 'TypeId should be a number integer value',
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            args: true,
            msg: 'CategoryId should not be empty',
          },
          isInt: {
            args: true,
            msg: 'CategoryId should be a number integer value',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input name should not be empty',
          },
        },
      },
      price: {
        type: DataTypes.BIGINT,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input price should not be empty',
          },
          isInt: {
            args: true,
            msg: 'Input price should be a number integer value',
          },
          notNegative(value) {
            /* istanbul ignore next */
            if (value < 0) {
              throw new Error('Input price should not be a negative value');
            }
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input description should not be empty',
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input imageUrl should not be empty',
          },
          isUrl: {
            args: true,
            msg: 'Invalid input Url',
          },
        },
      },
      location: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input location should not be empty',
          },
        },
      },
      sold: DataTypes.BOOLEAN,
      available: DataTypes.BOOLEAN,
      condition: DataTypes.FLOAT,
      startPrice: DataTypes.BIGINT,
      currentBid: DataTypes.BIGINT,
      currentUserBidName: DataTypes.STRING,
      currentUserBidId: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (Product) => {
          Product.sold = false;
          Product.available = true;
          Product.startPrice = Product.price;
          Product.currentBid = Product.price;
        },
      },
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
