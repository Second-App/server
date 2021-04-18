const { Cart } = require('../models');

class CartController {
  static async createCard(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { ProductId } = req.body;

      const newCart = {
        UserId,
        ProductId,
      };

      const checkAlreadyInCart = await Cart.findOne({
        where: {
          UserId,
          ProductId,
        },
      });

      if (checkAlreadyInCart)
        throw {
          name: 'CustomError',
          mgs: 'Item already in cart',
          status: 404,
        };

      const newCartData = await Cart.create(newCart);

      if (!newCartData) throw err;

      res.status(201).json({
        msg: 'added to cart',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCart(req, res, next) {
    try {
      const UserId = req.decoded.id;

      const cartData = await Cart.findAll({
        where: { UserId },
        include: ['Product', 'User'],
      });

      if (!cartData) throw err;

      res.status(200).json(cartData);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCart(req, res, next) {
    try {
      const { id } = req.params;

      const deleteCartData = await Cart.destroy({
        where: { id },
      });

      if (!deleteCartData) throw err;

      res.status(200).json({
        msg: 'Cart deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartController;
