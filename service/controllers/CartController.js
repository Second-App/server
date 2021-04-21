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
          msg: 'Item already in cart',
          status: 404,
        };

      const newCartData = await Cart.create(newCart);
      /* istanbul ignore if */
      if (!newCartData) throw err;
      const find = await Cart.findOne({
        where: { UserId, ProductId },
        include: ['Product', 'User'],
      });

      res.status(201).json(find);
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

      if (!cartData || cartData.length === 0) throw err;
      
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
      /* istanbul ignore if */
      if (!deleteCartData) throw err;
      
      res.status(200).json({
        msg: 'Cart deleted',
      });
    } catch (err) {
      /* istanbul ignore next */
      next(err);
    }
  }
}

module.exports = CartController;
