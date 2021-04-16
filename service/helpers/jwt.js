const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY);
};

module.exports = { generateToken };
