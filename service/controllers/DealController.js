const { Deal, Product } = require("../models");

class DealController {
  static async getAll(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const dealData = await Deal.findAll({ where: { UserId }, include: ["Product", "User"] });
      if (!dealData) throw err;
      res.status(200).json(dealData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createDeal(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { ProductId } = req.body;
      const patchProduct = await Product.update({ where: { id: ProductId } }, { sold: true });
      if (!patchProduct) throw err;
      const deal = await Deal.create({ UserId, ProductId });
      if (!deal) throw err;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteDeal(req, res, next) {
    try {
      const { id } = req.params;
      const { ProductId } = req.body;
      const patchProduct = await Product.update({ where: { id: ProductId } }, { sold: false });
      if (!patchProduct) throw err;
      const response = await Deal.destroy({ where: { id } });
      if (!response) throw err;
      res.status(200).json({ message: "deal deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = DealController;
