const router = require('express').Router();
const userRoute = require('./user');
const productRoute = require('./product');
const wishlistRoute = require('./wishlist');
const cartRoute = require('./cart');
const virtualAccountRoute = require('./virtualAccount');
const auctionRoute = require('./auction');
const chatRoute = require('./chat.js');
const categoryRoute = require('./category.js');
const typeRoute = require('./type.js');
// const dealsRoute = require('./deals');

router.use('/users', userRoute);
router.use('/products', productRoute);
router.use('/wishlists', wishlistRoute);
router.use('/carts', cartRoute);
router.use('/virtualAccount', virtualAccountRoute);
router.use('/auctions', auctionRoute);
router.use('/chats', chatRoute);
router.use('/categories', categoryRoute);
router.use('/types', typeRoute);

// router.use('/deals', dealsRoute);

module.exports = router;
