const Joi = require("joi");
const debug = require("debug")("alfred::controller::");

const model = require("../model")

const {
    USER_INPUT_SCHEMA,
    ADMIN_UPDATE_SCHEMA
} = require("../helper/schema/reservation")

exports.get = async function get(req, res, next) {
    const urlCode = req.params.urlCode;

    if(!urlCode){
        throw new Error("PARAMS_MISSING")
    }

    let response = await model.reservation.findOne({urlCode});
    if(response){
        res.send({
            data: response
        })   
    }

    throw new Error("RESERVATION_NOT_FOUND")
}

exports.insert =  async function insert(req, res, next) {
    const reservation = req.body;
    const {error, value} = Joi.validate(reservation, USER_INPUT_SCHEMA, {
        stripUnknown: true
    });

    if(error){
        if(error.details && error.details[0]){
            throw new Error(`RESERVATION_${error.details[0].path[0].toUpperCase()}_ERROR`)
        }
        throw new Error("SCHEMA_ERROR")
    }

    let response = await model.reservation.createReservation(reservation);
    res.send({
        data: response
    })
}

exports.update =  async function update(req, res, next) {
    const reservation = req.body;
    const urlCode = req.params.urlCode;
    const {error, value} = Joi.validate(reservation, ADMIN_UPDATE_SCHEMA, {
        stripUnknown: true
    });
    if(error){
        if(error.details && error.details[0]){
            if(error.details[0].path[0] === "status"){
                throw new Error("RESERVATION_STATUS_ERROR")
            }
        }
        throw new Error("SCHEMA_ERROR")
    }

    let response = await model.reservation.updateReservation(urlCode, reservation);
    if(response){
        return res.send({
            data: response
        })
    }

    throw new Error("RESERVATION_NOT_FOUND")
}
