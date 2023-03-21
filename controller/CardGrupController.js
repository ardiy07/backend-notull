const Validator = require('fastest-validator');
const { CardGrup, GrupMember } = require('../models');
const v = new Validator()

const getCardGrup = async (req, res) => {
    await CardGrup.findAll().then((result) => {
        res.status(200).json({
            status: 'Succes',
            data: result
        })
    }).catch((error) => {
        res.status(400).json({
            status: 'Failed',
            message: error.message
        })
    });
}

const createCardGrup = async (req, res) => {
    const { name } = req.body;

    const schema = {
        name: 'string'
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);

    try {
        await CardGrup.create({
            name: name,
            id_grup: 4
        }).then(async (result) => {
            await GrupMember.create({
                id_card_grup: result.id,
                id_user: 4
            }).then(() => {
                res.status(201).json({
                    status: 'Succes',
                    message: 'Card Berhasil di Tambahkan'
                })
            })
        })
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error.message
        })
    }
}


module.exports = { getCardGrup, createCardGrup }