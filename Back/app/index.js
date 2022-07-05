const express = require('express');
const {configMongoose} = require('./config/dbConfig');
const serverless = require("serverless-http");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const router = express.Router();

app.use(express.json());
app.use(router);
app.use(express.urlencoded({extended: true}));

const initRouter = () => {
    new (require('./controller/temario'))(router);
    new (require('./controller/problema'))(router);
}

(function () {
    initRouter();
    const db = configMongoose.mongoose.connection;
    configMongoose.mongoose.connect(configMongoose.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((err) => console.log(err));
    db.once('open', () => {
        console.log('Database connected');
    });
    app.listen(3000, () => {
        console.log(`Server is running on port 3000.`);
    });
})();

module.exports = app;
module.exports.handler = serverless(app);