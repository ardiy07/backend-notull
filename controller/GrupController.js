const { Grup, CardGrup, GrupMember, User } = require("../models")

const getGrup = async (req, res) => {
    try {
        const response = await Grup.findAll({
            attributes: ['name', 'deskripsi'],
            include: {
                model: CardGrup,
                as: 'card_grup',
                include: {
                    model: GrupMember,
                    as: 'members',
                    attributes: ['createdAt'],
                    include: {
                        model: User,
                        as: 'users',
                        attributes: ['name']
                    }
                }
            }
        });
        res.status(200).json({
            status: 'Succes',
            data: response
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error.message
        });
    }
}

const createGrup = async (req, res) => {
    const { nameGrup } = req.body;
    const schema = {
        nameGrup: 'string|min:1|max:100'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    const checkNameGrup = await Grup.findOne({
        where: {
            name: nameGrup
        }
    });
    if (checkNameGrup) return res.status(400).json({
        status: 'Failed',
        message: 'Grup Sudah Ada'
    });

    try {
        await Grup.create({
            name: nameGrup
        }).then(async (result) => {
            await CardGrup.create({
                name: nameGrup,
                id_grup: result.id,
            }).then(async (result) => {
                await GrupMember.create({
                    id_card_grup: result.id,
                    id_user: 4
                }).then(() => {
                    res.status(201).json({
                        status: 'Succes',
                        message: 'Grup Berhasil Dibuat'
                    })
                })
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error.message
        })
    }
}

const updateGrup = async (req, res) => {
    const { nameGrup } = req.body;

    const schema = {
        nameGrup: 'string|min:3|max:100'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    const checkNameGrup = await Grup.findOne({
        where: {
            name: nameGrup
        }
    });
    if (checkNameGrup) return res.status(400).json({
        status: 'Failed',
        message: 'Grup Sudah Ada'
    });

    try {
        await Grup.update({
            name: nameGrup
        }, {
            where: {
                name: req.params.id
            }
        }).then(() => {
            res.status(200).message({
                status: 'Succes'
            })
        });

    } catch (error) {
        res.json({
            status: 'Failed',
            message: error.message
        })
    }
}


module.exports = { getGrup, createGrup, updateGrup }