const {configMongoose} = require('../database/database');
const Temario = configMongoose.temario;

exports.findAll = async function () {
    try {
        return {data: await Temario.find({})};
    } catch (e) {
        throw e;
    }
}