/* istanbul ignore file */
const { User, Product } = require('../models');
// const bcrypt = require('bcryptjs')

const seederUser = () => {
  const body = {
    name: 'user',
    email: 'User3@mail.com',
    password: 'User123',
    ktpURL:
      'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
    address: 'Jakarta, Indonesia',
  };

  if (process.env.NODE_ENV == 'test') {
    return User.create(body);
  }
};

const seederSecondUser = () => {
  const body = {
    name: 'secondUser',
    email: 'secondUser@mail.com',
    password: 'User123',
    ktpURL:
      'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
    address: 'Jakarta, Indonesia',
  };

  if (process.env.NODE_ENV == 'test') {
    return User.create(body);
  }
};

module.exports = {
  seederUser,
  seederSecondUser,
};
