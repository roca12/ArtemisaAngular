const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
const dotenv = require('dotenv');
dotenv.config();

const configMongoose = {
    mongoose: Mongoose,
    url: process.env.DATABASE,
};

module.exports = {
    configMongoose
};