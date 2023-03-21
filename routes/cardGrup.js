var express = require('express');
const { getCardGrup } = require('../controller/CardGrupController');
var router = express.Router();

router.get('/', getCardGrup);

module.exports = router;