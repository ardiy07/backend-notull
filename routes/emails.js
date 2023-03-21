var express = require('express');
const { resetPassword } = require('../controller/AuthController');
const { emailConfirActive } = require("../controller/EmailController");
var router = express.Router();

router.put('/activasiakun', emailConfirActive);
router.put('/resetPassword', resetPassword);

module.exports = router;
