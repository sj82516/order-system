const mongoose = require("mongoose");

const {RESERVATION_TYPE, RESERVATION_STATUS} = require("../helper/schema/reservation")

var schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    urlCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: String,
        enum: RESERVATION_TYPE,
        required: true
    },
    status: {
        type: String,
        enum: RESERVATION_STATUS,
        required: true
    },
    orderDate: {
        type: String,
        required: true,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    modifyAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

schema.statics.createReservation = async function(reservation) {
    // check whether email is unique or not
    let email = reservation.email;
    let res =  await this.model("Reservation").findOne({
        email
    })
    if(res){
        throw new Error("EMAIL_EXISTS")
    }
    // gen url-friendly 8 char code for user to preview
    let urlCode = makeid()
    // check whether unique or not
    res = await this.model("Reservation").findOne({
        urlCode
    })
    while(res){
        urlCode = makeid()
    }

    reservation.urlCode = urlCode;
    reservation.createAt = new Date();
    reservation.modifyAt = new Date();
    return this.model("Reservation").create(reservation)
}

schema.statics.updateReservation = async function(urlCode, reservation) {
    reservation.modifyAt = new Date();
    return this.model("Reservation").findOneAndUpdate({
        urlCode
    }, reservation)
}

// generate base64 random string
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

const model = mongoose.model("Reservation", schema);
module.exports = model;