var express = require('express');
var router = express.Router();

router.use('/users', require('./user'))
router.use('/photos', require('./photo'))

module.exports = router;

