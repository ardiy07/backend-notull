const { User } = require("../models");

const emailConfirActive = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                refresh_token: req.query.tokenactive
            }
        });
        await User.update({
            is_confir: 1,
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
        res.status(500).json({ msg: error.message });
    }
}

module.exports = { emailConfirActive }