const mongoose = require("mongoose");
const moment = require("moment");

const {
    ORDER_TYPE,
    ORDER_STATUS
} = require("../helper/schema/order")

var schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    country: {
        type: String
    },
    type: {
        type: String,
        enum: ORDER_TYPE,
        required: true
    },
    status: {
        type: String,
        enum: ORDER_STATUS,
        required: true
    },
    order_date: {
        type: Date,
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
    },
    deleteAt: {
        type: Date,
        default: null
    }
})

schema.statics.createorder = async function (order) {
    // check whether email is unique or not
    let email = order.email;
    let res = await this.model("order").findOne({
        email
    })
    if (res) {
        throw new Error("EMAIL_EXISTS")
    }
    // gen url-friendly 8 char code for user to preview
    let id = makeid()
    // check whether unique or not
    res = await this.model("order").findOne({
        id
    })
    while (res) {
        id = makeid()
    }

    order.id = id;
    order.status = "pending";
    order.createAt = new Date();
    order.modifyAt = new Date();
    return this.model("order").create(order)
}

schema.statics.updateorder = async function (id, order) {
    order.modifyAt = new Date();
    return this.model("order").findOneAndUpdate({
        id,
        deleteAt: null
    }, order)
}

schema.statics.deleteRejectedOrder = async function () {
    return this.model("order").update({
        status: "reject",
        modifyAt: {
            "$lte": moment().subtract(3, "h")
        },
        deleteAt: null
    }, {
        deleteAt: new Date()
    }, {
        multi: true
    })
}

schema.statics.getOrderStatusDashboard = async function () {
    return this.model("order").aggregate([{
        $project: {
            date: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$order_date"
                }
            },
            type: "$type"
        }
    }, {
        $group: {
            _id: {
                type: "$type",
                date: "$date"
            },
            count: { $sum: 1 }
        }
    }])
}

// generate base64 random string
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const model = mongoose.model("order", schema);
module.exports = model;