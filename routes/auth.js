var express = require('express');
const { createUser, login, logout, resetPassword, activasiAkun, setPassword } = require('../controller/AuthController');
const { refreshToken } = require('../controller/RefreshToken');
const { verifyToken } = require('../middleware/verifyToken');
var router = express.Router();

router.post('/register', createUser);
router.put('/aktivasiakun', activasiAkun);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/token', refreshToken);
router.put('/resetpass', resetPassword);
router.put('/setpassword', setPassword);

module.exports = router;