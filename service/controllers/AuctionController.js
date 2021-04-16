const { Auction } = require('../models')

class AuctionController {
  static async getAll(req, res, next) {
    try {
      const auctionData = await Auction.findAll({
        include: ['Product']
      })
      if (!auctionData) throw err;
      res.status(200).json(auctionData)
      
    } catch (error) {
      next(error)
    }
  }

  static async create(req, res, next) {
    try {
      const UserId = req.decoded.id
      const { ProductId, startPrice, multiplier, currentBid} = req.body;
      const newAuction = { UserId, ProductId, startPrice, multiplier, currentBid}

      const response = await Auction.create(newAuction)
      if (!response) throw err;
      res.status(201).json(response)

    } catch (error) {
      next(error)
    }
  }

  static async updateCurrentBid(req, res, next) {
    try {
      const { id } = req.params
      const { currentBid } = req.body
      const response = await Auction.update({currentBid}, {where: { id }})
      if (!response) throw err;
      res.status(200).json({
        msg: "bid updated"
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params
      const response = await Auction.destroy({where: { id }})

      if(!response) throw err;
      res.status(200).json({
        msg: "auction data deleted"
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AuctionController