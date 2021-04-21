/** @format */

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const { hashPass } = require('../helpers/bcrypt.js');
  const checkPassword = require('../helpers/checkPassword.js');
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Product, {
        through: 'Communities',
        foreignKey: 'UserId',
      });
      User.belongsToMany(models.Product, {
        through: 'Carts',
        foreignKey: 'UserId',
      });
      User.belongsToMany(models.Product, {
        through: 'Wishlists',
        foreignKey: 'UserId',
      });
      User.belongsToMany(models.Product, {
        through: 'Deals',
        foreignKey: 'UserId',
      });
      User.belongsToMany(models.Product, {
        through: 'Auctions',
        foreignKey: 'UserId',
      });
      User.hasMany(models.Product);
      User.hasMany(models.Chat, { foreignKey: 'SenderId' });
      User.hasMany(models.Chat, { foreignKey: 'ReceiverId' });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input name should not be empty',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid email format',
          },
        },
        unique: {
          args: true,
          msg: 'Email already registered',
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          passwordRequirement(value) {
            if (checkPassword(value) === false) {
              throw new Error('Password must be at least contain a capital letter, a number or symbol, and minimum of 6 characters');
            }
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            args: true,
            msg: 'Invalid input Url',
          },
        },
      },
      balance: DataTypes.BIGINT,
      ktpURL: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            args: true,
            msg: 'Invalid input Url',
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input address should not be empty',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (User) => {
          User.password = hashPass(User.password);
          User.imageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
          User.balance = 0;
        },
      },
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
