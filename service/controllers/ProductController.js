const { Product } = require('../models');

class ProductController {
  static async getAll(req, res, next) {
    try {
      const productsData = await Product.findAll({
        include: ['Type', 'Category', 'User'],
        where: {
          sold: false,
          available: true,
        },
      });

      if (!productsData) throw err;

      res.status(200).json(productsData);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const productsData = await Product.findOne({
        where: { id },
        include: ['Type', 'Category', 'User'],
      });

      if (!productsData) throw err;

      res.status(200).json(productsData);
    } catch (err) {
      next(err);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const UserId = req.decoded.id;
      // console.log(UserId, "<<< ini user id di controol")
      const {
        TypeId,
        CategoryId,
        name,
        price,
        description,
        imageUrl,
        location,
        condition,
      } = req.body;

      const newProduct = {
        UserId,
        TypeId,
        CategoryId,
        name,
        price,
        description,
        imageUrl,
        location,
        condition,
      };
      const newProductData = await Product.create(newProduct);

      if (!newProductData) throw err;

      res.status(201).json(newProductData);
    } catch (err) {
      next(err);
    }
  }

  static async editAuction(req, res, next) {
    try {
      const { id } = req.params;
      const { currentBid, currentUserBidName } = req.body;

      const productData = await Product.findByPk(id);

      if (!productData) throw err;

      const checkingBid = Number(productData.currentBid) + 10000;

      if (checkingBid > currentBid)
        throw {
          name: 'CustomError',
          msg: 'next bid must be higher than 10000',
          status: 400,
        };

      const updateProductBid = {
        id: productData.id,
        UserId: productData.UserId,
        TypeId: productData.TypeId,
        CategoryId: productData.CategoryId,
        name: productData.name,
        price: productData.price,
        description: productData.description,
        imageUrl: productData.imageUrl,
        location: productData.location,
        sold: productData.sold,
        available: productData.available,
        condition: productData.condition,
        startPrice: productData.startPrice,
        currentBid,
        currentUserBidName,
      };

      const data = await Product.update(updateProductBid, {
        where: { id },
      });

      if (!data) throw err;

      res.status(200).json({
        msg: 'updated',
      });
    } catch (err) {
      next(err);
    }
  }

  static async editProduct(req, res, next) {
    try {
      const UserId = req.decoded.id;
      const { id } = req.params;

      const {
        TypeId,
        CategoryId,
        name,
        price,
        description,
        imageUrl,
        location,
        sold,
        available,
      } = req.body;

      const editedProduct = {
        UserId,
        TypeId,
        CategoryId,
        name,
        price,
        description,
        imageUrl,
        location,
        sold,
        available,
      };

      const editedProductData = await Product.update(editedProduct, {
        where: { id },
      });

      if (!editedProductData) throw err;

      res.status(200).json({
        msg: 'data updated',
      });
    } catch (err) {
      next(err);
    }
  }

  static async editSold(req, res, next) {
    try {
      const { id } = req.params;

      const { sold } = req.body;

      const editedSoldData = await Product.update(
        { sold },
        {
          where: { id },
        }
      );

      if (!editedSoldData) throw err;

      res.status(200).json({
        msg: 'data updated',
      });
    } catch (err) {
      next(err);
    }
  }

  static async editAvailable(req, res, next) {
    try {
      const { id } = req.params;

      const { available } = req.body;

      const editedAvailableData = await Product.update(
        { available },
        {
          where: { id },
        }
      );

      if (!editedAvailableData) throw err;

      res.status(200).json({
        msg: 'data updated',
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const deleteProductData = await Product.destroy({
        where: { id },
      });

      if (!deleteProductData) throw err;

      res.status(200).json({
        msg: 'Product deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
