'use strict';

const BAD_REQUEST = {
    message: "Bad Request",
    code: 400
}

const INVALID_CREDENTIALS = {
    message: "Invalid credentials entered",
    code: 401
}

const EMAIL_VERIFICATION_ERROR = {
    message: "Email verification is pending",
    code: 401
}

const NO_USER_EXIST = {
    message: "No user with this email exist",
    code: 401
}

const UNIQUE_EMAIL = {
    message: "Email id already registerd",
    code: 400
}

const errorHandler = (error, res) => {
    try{
        error = JSON.parse(error)
        res.status(error.code).send(error.message)
    } catch(e) {
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {
    BAD_REQUEST,
    INVALID_CREDENTIALS,
    EMAIL_VERIFICATION_ERROR,
    UNIQUE_EMAIL,
    NO_USER_EXIST,
    errorHandler
}
global.errorHandler = errorHandler
