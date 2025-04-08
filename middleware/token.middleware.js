var express = require('express');
var jwt = require('jsonwebtoken');
var response = require('../utils/respones');

module.exports = (req, res, next) => {
    try {
        const tokenBearer = req.headers.authorization
        if (tokenBearer === undefined || tokenBearer === ""){
            message="ไม่พบ access token"
            return response.sendResponse(res, 401, message)
        }
        const token = tokenBearer.split("Bearer ")[1]
        
        const userData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userData = userData
        next()
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            message="token หมดอายุ"
            return response.sendResponse(res, 401 , message)
        } else if (err.name === 'JsonWebTokenError') {
            message="token ไม่ถูกต้อง"
            return response.sendResponse(res, 403 , message)
        } else {
            return response.sendResponse(res, 500 , err.message)
        }
    }
}

