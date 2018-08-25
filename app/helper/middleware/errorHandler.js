const debug = require("debug")("alfred::errorHandle::");

function errorHandler(err, req, res, next) {
    debug(err)
    let response = errorHandle(err)
    res.status(response.statusCode).send({
        type: response.type,
        msg: response.msg
    })
}

function errorHandle(err) {
    switch (err.message) {
        case "NO_URL":
            {
                return {
                    statusCode: 404,
                    type: "NO_URL",
                    msg: "無此URL"
                }
            }
        case "EMAIL_EXISTS":
            {
                return {
                    statusCode: 409,
                    type: "EMAIL_EXISTS",
                    msg: "此Email已經預約過，請使用其他Email"
                }
            }
        case "ORDER_NOT_FOUND":
            {
                return {
                    statusCode: 404,
                    type: "NOT_FOUND",
                    msg: "查無預約記錄"
                }
            }
        case "ORDER_EMAIL_ERROR":
            {
                return {
                    statusCode: 401,
                    type: "SCHEMA_ERROR",
                    msg: "請填寫正確格式的Email"
                }
            }
        case "ORDER_ORDER_DATE_ERROR":
            {
                return {
                    statusCode: 401,
                    type: "SCHEMA_ERROR",
                    msg: "預約日期需晚於當下"
                }
            }
        case "ORDER_CONTENT_ERROR":
            {
                return {
                    statusCode: 404,
                    type: "SCHEMA_ERROR",
                    msg: "內容僅可為1~100字的大小寫英文字母"
                }
            }
        case "SCHEMA_ERROR":
            {
                return {
                    statusCode: 401,
                    type: "SCHEMA_ERROR",
                    msg: "欄位錯誤"
                }
            }
    }
    return {
        statusCode: 500,
        type: "SERVER_ERROR",
        msg: "伺服器錯誤"
    }
}

exports.errorHandler = errorHandler;
exports.errorHandle = errorHandle;