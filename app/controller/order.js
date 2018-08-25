const Joi = require("joi");
const debug = require("debug")("alfred::controller::");

const model = require("../model")

const {
    USER_INPUT_SCHEMA,
    ADMIN_UPDATE_SCHEMA
} = require("../helper/schema/order")

exports.getOrder = async function getOrder(req, res, next) {
    const id = req.params.id;

    if (!id) {
        throw new Error("PARAMS_MISSING")
    }

    let response = await model.order.findOne({
        id,
        deleteAt: null
    });
    if (response) {
        return res.send({
            data: response
        })
    }

    throw new Error("ORDER_NOT_FOUND")
}

exports.getOrderList = async function getOrderList(req, res, next) {
    let response = await model.order.find();
    if (response) {
        return res.send({
            data: response
        })
    }

    throw new Error("SERVER_ERROR")
}


exports.insertOrder = async function insertOrder(req, res, next) {
    const order = req.body;
    const {
        error,
        value
    } = Joi.validate(order, USER_INPUT_SCHEMA, {
        stripUnknown: true
    });
    if (error) {
        if (error.details && error.details[0]) {
            throw new Error(`ORDER_${error.details[0].path[0].toUpperCase()}_ERROR`)
        }
        throw new Error("SCHEMA_ERROR")
    }

    order.country = req.geo;

    let response = await model.order.createorder(order);
    return res.send({
        data: response
    })
}

exports.updateOrder = async function updateOrder(req, res, next) {
    const order = req.body;
    const id = req.params.id;
    const {
        error,
        value
    } = Joi.validate(order, ADMIN_UPDATE_SCHEMA, {
        stripUnknown: true
    });
    if (error) {
        if (error.details && error.details[0]) {
            if (error.details[0].path[0] === "status") {
                throw new Error("ORDER_STATUS_ERROR")
            }
        }
        throw new Error("SCHEMA_ERROR")
    }

    let response = await model.order.updateorder(id, order);
    if (response) {
        return res.send({
            data: response
        })
    }

    throw new Error("ORDER_NOT_FOUND")
}

exports.getOrderStatusDashboard = async function getOrderStatusDashboard(req, res){
    const response = await model.order.getOrderStatusDashboard()

    // reorganize the data format
    let data = {}
    if(response){
        response.map(d => {
            if(data[d._id.date]){
                data[d._id.date][d._id.type] = d.count
            }else {
                data[d._id.date] = {}
                data[d._id.date][d._id.type] = d.count
            }
        })
    }
    return res.send({
        data
    })
}