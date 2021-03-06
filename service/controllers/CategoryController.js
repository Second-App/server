const { Category, Product } = require('../models');

class CategoryController {
  static async getCategory(req, res, next) {
    try {
      const categoryData = await Category.findAll({
        include: ['Products'],
      });

      /* istanbul ignore next */
      if (!categoryData) throw err;

      res.status(200).json(categoryData);
    } catch (err) {
      /* istanbul ignore next */
      next(err);
    }
  }

  static async getProductsByCategoryId(req, res, next) {
    try {
      const { id } = req.params;

      const productsData = await Product.findAll({
        where: { CategoryId: +id },
        include: ['User', 'Type', 'Category'],
      });

      if (!productsData || productsData.length === 0) throw err;

      res.status(200).json(productsData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
