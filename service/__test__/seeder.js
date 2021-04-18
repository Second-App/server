const {User, Product} = require('../models')
// const bcrypt = require('bcryptjs')


const seederUser = () => {
  const body = {
    name: 'user',
    email: 'User3@mail.com',
    password: 'User123'
  }
  
  if (process.env.NODE_ENV == 'test') {
    return User.create(body)
  }
}


module.exports = {
  seederUser
}