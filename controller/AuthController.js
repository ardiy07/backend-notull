require('dotenv').config();
const { User } = require("../models");
const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const v = new Validator();
const jwt = require('jsonwebtoken');
const { verifikasiEmail, emailResetPass } = require('../helpers/EmailHelper');
const { Op } = require('sequelize');

const createUser = async (req, res) => {
    const { name, username, email, password, role_id, confPass } = req.body;

    const schema = {
        username: 'string',
        name: 'string',
        email: 'email',
        password: 'string|min:2',
        role_id: 'number'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    const checkEmail = await User.findOne({
        attribute: ['email'],
        where: {
            email: email
        }
    });

    if (checkEmail) return res.status(400).json({
        status: "Failed",
        message: "Email Sudah Terdaftar"
    });

    const checkUsername = await User.findOne({
        attribute: ['username'],
        where: {
            username: username
        }
    });

    if (checkUsername) return res.status(400).json({
        status: "Failed",
        message: "Username Sudah Ada"
    });

    if (password != confPass) return res.status(400).json({
        status: "Failed",
        message: "Confirmasi Password Salah"
    });

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    const token = jwt.sign({
        username: username,
        name: name,
        email: email
    }, process.env.ACCESS_TOKEN_SECRET);


    try {
        await User.create({
            username: username,
            name: name,
            email: email,
            password: hashPass,
            role_id: role_id,
            is_active: false,
            is_verifite: false,
            refresh_token: token
        });

        const templateEmail = {
            from: 'Ardi Coba',
            to: email,
            subject: 'Verifikasi Email',
            html: `<p>Verifikasi Akun anda dengan mengklik</p> <a href=${process.env.CLIENT_URL}activasiakun/${token} >Klik Disini<a/>`
        };

        verifikasiEmail(templateEmail);

        res.status(201).json({
            status: "Sukses",
            message: "Register Berhasil, Cek Email Untuk Mengaktifkan Akun",
            token: token,
        });
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

const activasiAkun = async (req, res) => {
    try {
        const token = req.body.refreshToken;

        const user = await User.findOne({
            where: {
                refresh_token: token
            }
        });
        await User.update({
            is_verifite: 1,
            refresh_token: null
        }, {
            where: {
                id: user.id
            }
        });

        res.json({
            status: 'Sukses',
            message: 'Email Berhasil di Aktivasi'
        })
    } catch (error) {
        res.status(error.errorStatus).json({ msg: error.message });
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [{
                    email: req.body.data
                }, {
                    username: req.body.data
                }]
            }
        });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({
            status: "Failed",
            message: "Password Salah"
        });

        if (user.is_verifite === false) return res.status(400).json({
            status: "Failed",
            message: "Silahkan Lakukan Aktivasi Email"
        })

        const userUuid = user.uuid;
        const username = user.username;
        const name = user.name;
        const email = user.email;

        const accessToken = jwt.sign({ userUuid, username, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });

        const refreshToken = jwt.sign({ userUuid, username, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await User.update({ refresh_token: refreshToken, is_active: 1 }, {
            where: {
                uuid: userUuid
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: "Akun Tidak Ditemukan",
        });
    }
}

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user) return res.sendStatus(204);

    await user.update({
        refresh_token: null,
        is_active: 0
    }, {
        where: {
            id: user.id
        }
    });
    res.clearCookie('refreshToken');

    return res.sendStatus(200);
}

const resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [{
                    email: req.body.data
                }, {
                    username: req.body.data
                }]
            },
        });

        if (!user) return res.status(400).json({
            status: "Failed",
            message: "Akun Tidak Ditemukan"
        });

        if (user.is_verifite === false) return res.status(400).json({
            status: "Failed",
            message: "Akun Belum Aktive"
        });

        const token = jwt.sign({
            username: user.username,
            name: user.name,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET);


        await User.update({ refresh_token: token }, {
            where: {
                id: user.id
            }
        });

        const templateResetPass = {
            from: 'Ardi Coba',
            to: user.email,
            subject: 'Reset Kata Sandi',
            html: `<p>Reset Kata Sandi Anda Dengan Klik Link Berikut</p> <a href=${process.env.CLIENT_URL}reset-password/${token} >Klik Disini<a/>`
        };

        emailResetPass(templateResetPass);

        res.status(200).json({
            status: "Sukses",
            message: "Silahkan Cek Email Anda",
            token: token
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error
        })
    }
}

const setPassword = async (req, res) => {
    const { password, confirPass, tokenactive } = req.body;

    const user = await User.findOne({
        where: {
            refresh_token: tokenactive
        }
    });

    if(!user) return res.sendStatus(402);

    const schema = {
        password: 'string'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    if (password != confirPass) return res.status(400).json({
        status: "Failed",
        message: "Confirmasi Password Salah"
    });


    const match = await bcrypt.compare(password, user.password);
    if(match) return res.status(400).json({
        status: "Failed",
        message: "Masukan Kata Sandi yang Baru"
    });


    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    try {
        await User.update({
            password: hashPass,
            refresh_token: null
        }, {
            where: {
                refresh_token: tokenactive
            }
        });

        res.status(200).json({
            status: 'Sukses',
            message: 'Password Berhasil di Reset'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Password Gagal di Reset'
        })
    }
}

module.exports = { createUser, activasiAkun, login, logout, resetPassword, setPassword };