const router = require('express').Router()
const AuctionController = require('../controllers/AuctionController')
const { authenticate } = require('../middlewares/authenticate.js');

router.get('/', AuctionController.getAll) 

router.use(authenticate)
router.post('/', AuctionController.create)

router.patch('/:id', AuctionController.updateCurrentBid)
router.delete('/:id', AuctionController.delete)

module.exports = router