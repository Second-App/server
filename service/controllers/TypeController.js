const { Type, Product } = require('../models');

class TypeController {
  static async getTypes(req, res, next) {
    try {
      const typesData = await Type.findAll();

      if (!typesData) throw err;

      res.status(200).json(typesData);
    } catch (err) {
      next(err);
    }
  }

  static async getProductsByTypeId(req, res, next) {
    try {
      const { id } = req.params;

      const productsData = await Product.findAll({
        where: { TypeId: id, currentUserBidId: null },
        include: ['User', 'Type', 'Category'],
      });

      if (!productsData) throw err;

      res.status(200).json(productsData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TypeController;
