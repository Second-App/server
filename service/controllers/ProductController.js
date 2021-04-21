/** @format */

const { Product, Community, User } = require('../models');
const midtransClient = require('midtrans-client');
const uploadFile = require('../middlewares/multer');
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AccessKeyID,
  secretAccessKey: process.env.SecretAccessKey,
});

class ProductController {
  static async getAll(req, res, next) {
    try {
      const productsData = await Product.findAll({
        include: ['Type', 'Category', 'User'],
        where: {
          sold: false,
          available: true,
        },
        order: [['updatedAt', 'DESC']],
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
      await uploadFile(req, res);
      if (!req.files || !req.files.length) {
        const UserId = req.decoded.id;
        const newProduct = {
          UserId,
          TypeId: req.body.TypeId,
          CategoryId: req.body.CategoryId,
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          imageUrl: req.body.imageUrl,
          location: req.body.location,
          condition: req.body.condition,
        };

        Product.create(newProduct)
          .then((data) => {
            if (!data) throw err;
            res.status(201).json(data);
          })
          .catch((err) => {
            console.log(err)
            next(err);
          });

          return
      }

      let path = req.files[0].path;
      const params = {
        ACL: 'public-read',
        Bucket: 'secondh8',
        Body: fs.createReadStream(path),
        Key: `userData/${'_' + Math.random().toString(36).substr(2, 9)}${
          req.files[0].originalname
        }`,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err)
          res.status(500).json(err);
        }
        if (data) {
          fs.unlinkSync(path); // ini menghapus file yang dikirim agar tidak disimpan di local
          const url = data.Location;
          const UserId = req.decoded.id;
          const newProduct = {
            UserId,
            TypeId: req.body.TypeId,
            CategoryId: req.body.CategoryId,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            imageUrl: url,
            location: req.body.location,
            condition: req.body.condition,
          };

          Product.create(newProduct)
            .then((data) => {
              if (!data) throw err;
              res.status(201).json(data);
            })
            .catch((err) => {
              console.log(err)
              next(err);
            });
        }
      });
    } catch (err) {
      console.log(err)
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
        price: currentBid,
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
      
      await uploadFile(req, res)
      if(!req.files || !req.files.length) {
        const {
          TypeId,
          CategoryId,
          name,
          price,
          description,
          location,
          sold,
          available,
          condition,
          imageUrl
        } = req.body;
  
        const editedProduct = {
          UserId,
          TypeId,
          CategoryId,
          name,
          price,
          description,
          location,
          sold,
          available,
          condition,
          imageUrl
        };

        Product.update(editedProduct, {
          where: { id },
        })
        .then(editedProduct => {
          if (!editedProduct) throw err;
          res.status(200).json({
            msg: 'data updated',
          });
        })
        .catch(err => {
          
          next(err)
        })
        return
        // throw { message: 'please upload a file!' }
      }
      let path = req.files[0].path
      const params = {
        ACL: 'public-read',
        Bucket: 'secondh8',
        Body: fs.createReadStream(path),
        Key: `userData/${'_' + Math.random().toString(36).substr(2, 9)}${
          req.files[0].originalname
        }`
      }
      
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err, "error disini")
          res.status(500).json(err)
        }
        if (data) {
          fs.unlinkSync(path)
          const url = data.Location
          
          const {
            TypeId,
            CategoryId,
            name,
            price,
            description,
            location,
            sold,
            available,
            condition
          } = req.body;
    
          const editedProduct = {
            UserId,
            TypeId,
            CategoryId,
            name,
            price,
            description,
            imageUrl: url,
            location,
            sold,
            available,
            condition
          };
          
          Product.update(editedProduct, {
            where: { id },
          })
          .then(editedProduct => {
            if (!editedProduct) throw err;
            res.status(200).json({
              msg: 'data updated',
            });
          })
          .catch(err => {
            
            next(err)
          })
        }
      })
      
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
          order_id:
            'second-order-xx-' + Math.round(new Date().getTime() / 1000),
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

      res
        .status(200)
        .json({ token: transactionToken, clientKey: snap.apiConfig.clientKey });
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
