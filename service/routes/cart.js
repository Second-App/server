const router = require('express').Router()

router.post('/')
router.get('/') 

router.patch('/:id')
router.delete('/:id')

module.exports = router