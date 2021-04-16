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
      // define association here
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
              throw new Error(
                'Password must be at least contain a capital letter, a number or symbol, and minimum of 6 characters'
              );
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
      balance: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (User) => {
          User.password = hashPass(User.password);
          User.balance = 0;
        },
      },
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
