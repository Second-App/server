/** @format */

const { Product, Community, User } = require('../models');
const midtransClient = require('midtrans-client');

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
      const { TypeId, CategoryId, name, price, description, imageUrl, location, condition } = req.body;

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
      const { currentBid, currentUserBidName, currentUserBidId } = req.body;

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
        currentUserBidId,
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

      const { TypeId, CategoryId, name, price, description, imageUrl, location, sold, available } = req.body;

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

  static async checkoutProduct(req, res, next) {
    try {
      const { id } = req.params;
      const currentUser = req.decoded;
      const { dataValues } = await Product.findOne({
        where: { id },
        include: ['User'],
      });
      const userData = await User.findOne({ where: { id: currentUser.id } });

      const seller = dataValues.User.dataValues;
      const product = dataValues;
      const buyer = userData.dataValues;

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-JqApsadC5gDq85Ewopy-iW_V',
        clientKey: 'SB-Mid-client-tFhuCmNTmy26af7I',
      });

      let parameter = {
        transaction_details: {
          order_id: 'second-order-xx-' + Math.round(new Date().getTime() / 1000),
          gross_amount: +product.price,
        },
        item_details: [
          {
            id: product.id,
            price: +product.price,
            quantity: 1,
            name: product.name,
            brand: '',
            category: '',
            merchant_name: seller.name,
          },
        ],
        customer_details: {
          first_name: buyer.name,
          last_name: '',
          email: buyer.email,
          phone: '+62 812 3456 1221',
          billing_address: {
            first_name: userData.name,
            last_name: '',
            email: buyer.email,
            phone: '+62 812 3456 1221',
            address: buyer.address,
            city: 'Jakarta',
            postal_code: '12190',
            country_code: 'IDN',
          },
          shipping_address: {
            first_name: buyer.name,
            last_name: '',
            email: buyer.email,
            phone: '+62 812 3456 1221',
            address: buyer.address,
            city: 'Jakarta',
            postal_code: '12190',
            country_code: 'IDN',
          },
        },
        credit_card: {
          secure: true,
        },
      };
      const transactionToken = await snap.createTransactionToken(parameter);

      res.status(200).json({ token: transactionToken, clientKey: snap.apiConfig.clientKey });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static changeOwner = async (req, res, next) => {
    try {
      console.log(req.body, 'ini reqbody');
      const { newUserId, ProductId, id } = req.body;
      const data = await Product.update(
        {
          UserId: newUserId,
        },
        {
          where: { id: ProductId },
          returning: true,
        }
      );

      if (!data) throw err;
      console.log(data, 'ini bentuk cinta <<<<<<<');
      const deleteCom = await Community.destroy({ where: { id } });

      res.status(200).json(data);
    } catch (err) {
      console.log(err, ' ini ksjfklasdjklf;ajsdkl');
      next(err);
    }
  };
}

module.exports = ProductController;
