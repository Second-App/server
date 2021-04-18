'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auction.belongsTo(models.User);
      Auction.belongsTo(models.Product);
    }
  }
  Auction.init(
    {
      UserId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      startPrice: DataTypes.BIGINT,
      multiplier: DataTypes.BIGINT,
      currentBid: {
        type: DataTypes.BIGINT,
        // validate: {
        //   checkBid(value) {
        //     console.log(this.startPrice, this.multiplier, value, "<< ini di model")
        //     if (value <= (this.startPrice + this.multiplier)) {
        //       throw new Error(`Bid must be multipled of multiplier value`)
        //     }
        //   }
        // }
      },
      currentUserBidId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Auction',
    }
  );
  Auction.addHook('beforeCreate', (auction, options) => {
    auction.currentBid = auction.startPrice;
  });
  return Auction;
};
