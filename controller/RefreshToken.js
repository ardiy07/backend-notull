const { User } = require('../models');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) return res.sendStatus(403);
            const userUuid = user.uuid;
            const username = user.username;
            const name = user.name;
            const email = user.email;
            const roleId = user.role_id;

            const accessToken = jwt.sign({ userUuid, username, name, email, roleId }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            });

            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { refreshToken };