const jwt = require('jsonwebtoken');
const { User } = require('../models');

const isSuperAdmin = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({
        where: {
            refreshToken: refreshToken
        }
    });

    if(!user) return res.sendStatus(401);
    if(user.roleId !== 1) return res.status(402).json({
        status: "Failed",
        message: "Tidak Ada Akses"
    });
    next();
}

const isAdmin = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({
        where: {
            refreshToken: refreshToken
        }
    });

    if(!user) return res.sendStatus(401);
    if(user.roleId !== 2) return res.status(402).json({
        status: "Failed",
        message: "Tidak Ada Akses"
    });
    next();
}

module.exports = { isSuperAdmin, isAdmin };