const router = require('express').Router()

router.get('/:id') 
router.post('/register')
router.post('/login')

router.put('/edit/:id')
router.patch('/patch/:id')
router.delete('/delete/:id')

module.exports = router