'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Chat.belongsTo(models.User);
    }
  }
  Chat.init(
    {
      SenderId: DataTypes.INTEGER,
      ReceiverId: DataTypes.INTEGER,
      message: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input message should not be empty',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Chat',
    }
  );
  return Chat;
};
