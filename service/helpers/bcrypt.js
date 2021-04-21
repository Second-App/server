const bcrypt = require('bcryptjs');

/* istanbul ignore next */
const hashPass = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/* istanbul ignore next */
const comparePass = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { hashPass, comparePass };
