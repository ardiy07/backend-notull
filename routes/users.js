var express = require('express');
var router = express.Router();
var { getUsers, getUserById, updateUser, deleteUser } = require('../controller/UserController');
const { isSuperAdmin, isAdmin } = require('../middleware/multiRole');
var { verifyToken } = require('../middleware/verifyToken');

router.get('/',  getUsers);
router.get('/:id',  getUserById);
router.put('/:id',  updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
