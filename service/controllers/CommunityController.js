/** @format */

const { Community } = require('../models');

class CommunityController {
  static async createCard(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { ProductId } = req.body;

      const newCommunity = {
        UserId,
        ProductId,
      };

      const checkAlreadyInCommunity = await Community.findOne({
        where: {
          UserId,
          ProductId,
        },
      });

      if (checkAlreadyInCommunity)
        throw {
          name: 'CustomError',
          msg: 'Item already in Community',
          status: 404,
        };

      const newCommunityData = await Community.create(newCommunity);

      if (!newCommunityData) throw err;

      const bebek = await Community.findOne({ where: { UserId, ProductId }, include: ['Product', 'User'] });

      console.log(bebek, 'ini bebek');
      res.status(201).json(bebek);
    } catch (err) {
      next(err);
    }
  }

  static async getCommunity(req, res, next) {
    try {
      const UserId = req.decoded.id;

      const CommunityData = await Community.findAll({
        include: ['Product', 'User'],
      });

      if (!CommunityData) throw err;

      res.status(200).json(CommunityData);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCommunity(req, res, next) {
    try {
      const { id } = req.params;

      const deleteCommunityData = await Community.destroy({
        where: { id },
      });

      if (!deleteCommunityData) throw err;

      res.status(200).json({
        msg: 'Community deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CommunityController;
