const {configMongoose} = require('../database/database');
const Problema = configMongoose.problema;

exports.findAll = async function () {
    try {
        return {data: await Problema.find({})};
    } catch (e) {
        throw e;
    }
}