const Joi = require("joi");

const ORDER_TYPE = ["A", "B", "C", "D"];
const ORDER_STATUS = ["pending", "processing", "reject", "finish"];

const USER_INPUT_SCHEMA = {
    email: Joi.string().email().required(),
    type: Joi.string().valid(ORDER_TYPE).required(),
    order_date: Joi.date().min('now').required(),
    content: Joi.string().regex(/^[a-zA-Z]+$/).min(1).max(100).required()
}

const ADMIN_UPDATE_SCHEMA = {
    status: Joi.string().required()
}

exports.ORDER_TYPE = ORDER_TYPE
exports.ORDER_STATUS = ORDER_STATUS
exports.USER_INPUT_SCHEMA = USER_INPUT_SCHEMA
exports.ADMIN_UPDATE_SCHEMA = ADMIN_UPDATE_SCHEMA