const { User } = require('../models');
const { comparePass } = require('../helpers/bcrypt.js');
const { generateToken } = require('../helpers/jwt.js');
const uploadFile = require('../middlewares/multer');
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AccessKeyID,
  secretAccessKey: process.env.SecretAccessKey,
});

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password, ktpURL, address } = req.body;

      const newUser = {
        name,
        email,
        password,
        ktpURL,
        address,
      };

      const newUserData = await User.create(newUser);

      /* istanbul ignore next */
      if (!newUserData) throw err;

      res.status(201).json({
        id: newUserData.id,
        name: newUserData.name,
        email: newUserData.email,
        imageUrl: newUserData.imageUrl,
        balance: newUserData.balance,
        ktpURL: newUserData.ktpURL,
        address: newUserData.address,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user)
        throw {
          name: 'CustomError',
          msg: 'Invalid Email or Password',
          status: 400,
        };

      const comparePassword = await comparePass(password, user.password);

      /* istanbul ignore next */
      if (!comparePassword)
        throw {
          name: 'CustomError',
          msg: 'Invalid Email or Password',
          status: 400,
        };

      const access_token = generateToken({
        id: user.id,
        email: user.email,
      });

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        balance: user.balance,
        ktpURL: user.ktpURL,
        address: user.address,
        access_token: access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { id } = req.params;

      const profileData = await User.findOne({
        where: { id },
        include: ['Products'],
      });

      /* istanbul ignore next */
      if (!profileData) throw err;

      res.status(200).json({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        imageUrl: profileData.imageUrl,
        balance: profileData.balance,
        ktpURL: profileData.ktpURL,
        address: profileData.address,
        Products: profileData.Products,
      });
    } catch (err) {
      /* istanbul ignore next */
      next(err);
    }
  }

  /* istanbul ignore next */
  static async editProfile(req, res, next) {
    try {
      await uploadFile(req, res);

      if (!req.files.length) {
        throw { message: 'please upload a file!' };
      }

      let pathImageUrl = req.files[0].path;
      const paramsImage = {
        ACL: 'public-read',
        Bucket: 'secondh8',
        Body: fs.createReadStream(pathImageUrl),
        Key: `userData/${'_' + Math.random().toString(36).substr(2, 9)}${
          req.files[0].originalname
        }`,
      };
      const { id } = req.params;
      s3.upload(paramsImage, (err, data) => {
        if (err) {
          console.log(err, '<< error disini');
          res.status(500).json(err);
        }
        if (data) {
          fs.unlinkSync(pathImageUrl); //menghapus file yg dikirim
          console.log(data.Location, '<< data di cont upload');
          const urlImage = data.Location;

          User.findByPk(id)
            .then((profile) => {
              if (!profile) throw err;
              const { name, email, address } = req.body;

              const updateProfile = {
                id,
                name,
                email,
                password: profile.password,
                imageUrl: urlImage,
                balance: profile.balance,
                address,
              };
              console.log(updateProfile);
              return User.update(updateProfile, {
                where: { id },
              });
            })
            .then((updatedProfile) => {
              if (!updatedProfile) throw err;
              res.status(200).json({
                msg: 'data updated',
              });
            })
            .catch((err) => {
              console.log(err, '<< error get id');
              next(err);
            });
        }
      });
    } catch (err) {
      console.log(err, '<< error di catch');
      next(err);
    }
  }

  /* istanbul ignore next */
  static async changePassword(req, res, next) {
    try {
      const { id } = req.params;

      const profileData = await User.findByPk(id);

      if (!profileData) throw err;

      const { oldpassword, newpassword } = req.body;

      const comparePassword = await comparePass(
        oldpassword,
        profileData.password
      );

      if (!comparePassword)
        throw {
          name: 'CustomError',
          msg: 'Invalid old password input',
          status: 400,
        };

      const updateProfilePassword = await User.update(
        { password: newpassword },
        {
          where: { id },
        }
      );

      if (!updateProfilePassword) throw err;

      res.status(200).json({
        msg: 'password updated',
      });
    } catch (err) {
      next(err);
    }
  }

  /* istanbul ignore next */
  static async updateBalance(req, res, next) {
    try {
      const { id } = req.params;
      const { balance } = req.body;

      const userData = await User.findByPk(id);

      if (!userData) throw err;

      const newbalance = Number(userData.balance) + Number(balance);

      const updateBalanceData = await User.update(
        { balance: newbalance },
        {
          where: { id },
        }
      );

      if (!updateBalanceData) throw err;

      res.status(200).json({
        msg: 'balance updated',
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const deleteUserData = await User.destroy({
        where: { id },
      });

      if (!deleteUserData) throw err;

      res.status(200).json({
        msg: 'user deleted',
      });
    } catch (err) {
      /* istanbul ignore next */
      next(err);
    }
  }
}

module.exports = UserController;
