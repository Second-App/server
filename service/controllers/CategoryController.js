const { Category, Product } = require('../models');

class CategoryController {
  static async getCategory(req, res, next) {
    try {
      const categoryData = await Category.findAll();

      if (!categoryData) throw err;

      res.status(200).json(categoryData);
    } catch (err) {
      next(err);
    }
  }

  static async getProductsByCategoryId(req, res, next) {
    try {
      const { id } = req.params;

      const productsData = await Product.findAll({
        where: { CategoryId: id },
        include: ['User', 'Type', 'Category'],
      });

      const CategoryProducts = await Category.findOne({
        where: {id},
        include: ["Products"]
      })

      console.log(CategoryProducts.Products, 30)

      if (!productsData) throw err;

      res.status(200).json(productsData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
