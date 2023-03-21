const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const { Op } = require('sequelize');
const v = new Validator();

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.body) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";
        const rowOff = limit * page;
        const totRow = await User.count({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            }
        });

        const totPage = Math.ceil(totRow / page);

        const response = await User.findAll({
            limit: limit,
            offset: rowOff,
            order: [
                ['name', 'ASC']
            ],
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            },
            include: [
                {
                    model: Role, as: 'roles',
                    attributes: ['name_role']
                }
            ],
            attributes: ['name', 'uuid', 'username', 'email', 'is_activ', 'is_confir'],

        });
        res.status(200).json({
            status: "Sukses",
            data: response,
            page: page,
            limit: limit,
            totRow: totRow,
            totPage: totPage
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user) return res.sendStatus(401);
        let response;
        if (user.role_id === 1) {
            response = await User.findOne({
                attributes: ['name', 'uuid', 'username', 'email', 'is_active', 'is_confir'],
                include: [
                    {
                        model: Role, as: 'roles',
                        attributes: ['name_role']
                    }
                ],
                where: {
                    id: req.params.id
                }
            });
        } else {
            response = await User.findOne({
                attributes: ['name', 'uuid', 'username', 'email', 'is_active'],
                include: [
                    {
                        model: Role, as: 'roles',
                        attributes: ['name_role']
                    }
                ],
                where: {
                    id: user.id
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Data Tidak Ditemukan"
        });
    }
}

const updateUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });

    let userUpdate;

    if (user.roleId === 1) {
        userUpdate = await User.findOne({
            where: {
                id: req.params.id
            }
        })
    } else {
        userUpdate = await User.findOne({
            where: {
                id: user.id
            }
        })
    };

    if (!userUpdate) return res.status(404).json({
        status: "Failed",
        message: "User Tidak Ditemukan"
    })

    const { name, username, email, password, role_id, confPass } = req.body;

    const schema = {
        name: 'string',
        email: 'email',
        username: 'string',
        role_id: 'number'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    let hashPass;
    if (password === "" || password === null) {
        hashPass = userUpdate.password;
    } else {
        const salt = await bcrypt.genSalt();
        hashPass = await bcrypt.hash(password, salt);
        if (password != confPass) return res.status(400).json({
            status: "Failed",
            message: "Confirmasi Password Salah"
        });
    }

    let cekEmail = user.email;
    let cekUsername = user.username;

    if (email !== cekEmail) {
        const checkEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (checkEmail) return res.status(400).json({
            status: "Failed",
            message: "Email Sudah Terdaftar"
        });
    }

    if (email !== cekUsername) {
        const checkUsername = await User.findOne({
            where: {
                username: username
            }
        });
        if (checkUsername) return res.status(400).json({
            status: "Failed",
            message: "Username Sudah Terdaftar"
        });
    }

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPass,
            role_id: role_id,
            username: username
        }, {
            where: {
                id: userUpdate.id
            }
        });
        res.json({
            status: "Sukses",
            message: "Update Berhasil"
        });
    } catch (error) {
        res.json({
            status: "Failed",
            message: "Update Gagal"
        });
    }
}

const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!user) return res.status(404).json({
        status: "Failed",
        message: "User Tidak Ditemukan"
    })

    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.json({
            status: "Sukses",
            message: "Delete User Berhasil"
        });
    } catch (error) {
        res.json({
            status: "Failed",
            message: "Delete User Gagal"
        });
    }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser };