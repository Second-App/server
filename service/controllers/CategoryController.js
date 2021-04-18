const { Category } = require('../models');

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

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const categoryData = await Category.findByPk(id);

      if (!categoryData) throw err;

      res.status(200).json(categoryData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
