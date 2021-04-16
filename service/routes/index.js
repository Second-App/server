const router = require('express').Router()
const userRoute = require('./user')
const productRoute = require('./product')
const wishlistRoute = require('./wishlist')
const cartRoute = require('./cart')
const dealsRoute = require('./deals')
const categoryRoute = require('./category')

router.use('/users', userRoute)
router.use('/products', productRoute)
router.use('/wishlists', wishlistRoute)
router.use('/carts', cartRoute)
router.use('/deals', dealsRoute)
router.use('/category/:id', categoryRoute)

module.exports = router