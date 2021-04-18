const { User } = require('../models');
const { comparePass } = require('../helpers/bcrypt.js');
const { generateToken } = require('../helpers/jwt.js');

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

      const profileData = await User.findByPk(id);

      if (!profileData) throw err;

      res.status(200).json({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        imageUrl: profileData.imageUrl,
        balance: profileData.balance,
        ktpURL: profileData.ktpURL,
        address: profileData.address,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editProfile(req, res, next) {
    try {
      const { id } = req.params;

      const profileData = await User.findByPk(id);
      // console.log(profileData)
      if (!profileData) throw err;

      const { name, email, imageUrl, ktpURL, address } = req.body;

      const updateProfile = {
        id,
        name,
        email,
        password: profileData.password,
        imageUrl,
        balance: profileData.balance,
        ktpURL,
        address,
      };

      const updatedProfileData = await User.update(updateProfile, {
        where: { id },
      });

      if (!updatedProfileData) throw err;

      res.status(200).json({
        msg: 'data updated',
      });
    } catch (err) {
      next(err);
    }
  }

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

  static async updateBalance(req, res, next) {
    try {
      const { id } = req.params;
      const { balance } = req.body;

      const userData = await User.findByPk(id);

      if (!userData) throw err;

      const newbalance = userData.balance + balance;

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
      next(err);
    }
  }
}

module.exports = UserController;
