const mongoose = require('mongoose');
const conf = require("../../conf.json");

mongoose.connect(`mongodb://${conf.db.host}/test?replicaSet=${conf.db.replicaSet}`);

const order = require("./order")

module.exports = {
    order
}
