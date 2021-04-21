/** @format */

const { User } = require('../models');
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.access_token;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const checkId = await User.findByPk(decoded.id);

    /* istanbul ignore next */
    if (!checkId)
      throw {
        name: 'CustomError',
        msg: 'id not found',
        status: 404,
      };

    req.decoded = decoded;

    next();
  } catch (err) {
    /* istanbul ignore next */
    if (!err.msg) {
      next({
        name: 'CustomError',
        msg: 'invalid token',
        status: 401,
      });
      /* istanbul ignore next */
    } else {
      next(err);
    }
  }
};

module.exports = { authenticate };
