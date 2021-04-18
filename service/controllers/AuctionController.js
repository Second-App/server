const { Auction } = require('../models');

class AuctionController {
  static async getAll(req, res, next) {
    try {
      const auctionData = await Auction.findAll({
        include: ['Product', 'User'],
      });
      if (!auctionData) throw err;

      res.status(200).json(auctionData);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { ProductId, startPrice, multiplier, currentBid } = req.body;
      const newAuction = {
        UserId,
        ProductId,
        startPrice,
        multiplier,
        currentBid,
      };

      const response = await Auction.create(newAuction);
      if (!response) throw err;
      res.status(201).json({ msg: 'auction created' });
    } catch (error) {
      next(error);
    }
  }

  static async updateCurrentBid(req, res, next) {
    try {
      const { id } = req.params;
      const { currentBid } = req.body;
      const { dataValues } = await Auction.findByPk(id);

      let checkBid =
        currentBid % dataValues.multiplier ||
        currentBid >= dataValues.multiplier + dataValues.startPrice;

      if (checkBid !== true) {
        throw {
          name: 'CustomError',
          msg: 'Bid must be multipled of multiplier value',
          status: 404,
        };
      } else {
        const response = await Auction.update(
          { currentBid },
          { where: { id } }
        );
        if (!response) throw err;
        res.status(200).json({
          message: 'bid multiplier increased',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await Auction.destroy({ where: { id } });

      if (!response) throw err;
      res.status(200).json({
        message: 'auction deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuctionController;
