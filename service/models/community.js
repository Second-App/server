/** @format */

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Community extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Community.belongsTo(models.User);
            Community.belongsTo(models.Product);
        }
    }
    Community.init(
        {
            UserId: DataTypes.STRING,
            ProductId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Community',
        }
    );
    return Community;
};
