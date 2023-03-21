var express = require('express');
const { getGrup, createGrup, updateGrup } = require('../controller/GrupController');
var router = express.Router();

router.get('/', getGrup);
router.post('/', createGrup);
router.put('/:id', updateGrup);

module.exports = router;