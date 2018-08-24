const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const reservation = require("./reservation")

module.exports = {
    reservation
}
