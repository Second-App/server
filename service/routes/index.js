const router = require('express').Router();
const userRoute = require('./user');
const productRoute = require('./product');
const wishlistRoute = require('./wishlist');
const cartRoute = require('./cart');
const dealsRoute = require('./deals');
const categoryRoute = require('./category');
const virtualAccountRoute = require('./virtualAccount');
const auctionRoute = require('./auction')

router.use('/users', userRoute);
router.use('/products', productRoute);
router.use('/wishlists', wishlistRoute);
router.use('/carts', cartRoute);
router.use('/deals', dealsRoute);
router.use('/category', categoryRoute);
router.use('/virtualAccount', virtualAccountRoute);
router.use('/auctions', auctionRoute)

module.exports = router;
