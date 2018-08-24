const Joi = require("joi");

const RESERVATION_TYPE = ["A", "B", "C", "D"];
const RESERVATION_STATUS = ["pending", "processing", "reject", "finish"];

const USER_INPUT_SCHEMA = {
    email: Joi.string().email().required(),
    type: Joi.string().valid(RESERVATION_TYPE).required(),
    status: Joi.string().valid(RESERVATION_STATUS).required(),
    order_date: Joi.date().min('now').required(),
    content: Joi.string().regex(/^[a-zA-Z]+$/).min(1).max(100).required()
}

const ADMIN_UPDATE_SCHEMA = {
    status: Joi.string().required()
}

exports.RESERVATION_TYPE = RESERVATION_TYPE
exports.RESERVATION_STATUS = RESERVATION_STATUS
exports.USER_INPUT_SCHEMA = USER_INPUT_SCHEMA
exports.ADMIN_UPDATE_SCHEMA = ADMIN_UPDATE_SCHEMA