const { Wishlist } = require('../models')

class WishlistController {
  static async createWishlist(req, res, next) {
    try {
      const UserId = req.decoded.id
      const { ProductId } = req.body

      const newWishlist = {
        ProductId,
        UserId,
      }

      const checkAlreadyExist = await Wishlist.findOne({
        where: {
          ProductId,
          UserId,
        },
      })

      if (checkAlreadyExist)
        throw {
          name: 'CustomError',
          msg: 'You already wishlist this product',
          status: 400,
        }

      const data = await Wishlist.create(newWishlist)
      console.log(data)
      if (!data) throw err
      const createdWishlist = await Wishlist.findOne({
        where: { ProductId, UserId },
        include: ['Product', 'User'],
      })
      
      res.status(201).json(createdWishlist)
    } catch (err) {
      console.log(err, 38)
      next(err)
    }
  }

  static async getWishlist(req, res, next) {
    try {
      const UserId = req.decoded.id

      const data = await Wishlist.findAll({
        where: { UserId },
        include: ['Product'],
      })

      if (!data) throw err

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }

  static async deleteWishlist(req, res, next) {
    try {
      const { id } = req.params

      const data = await Wishlist.destroy({
        where: { id },
      })

      if (!data) throw err

      res.status(200).json({
        msg: 'Wishlist deleted',
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = WishlistController
