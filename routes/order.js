var express = require('express');
var router = express.Router();
var Product = require('../models/product.model');
var Order = require('../models/order.model');
var User = require('../models/user.model');
var response = require('../utils/respones');
const middleware = require('../middleware/token.middleware');

/* GET orders */
router.get('/', [middleware], async function (req, res, next) {
    try {
        const orders = await Order.find({})
        message="ข้อมูลการสั่งซื้อสินค้า"
        return response.sendResponse(res, 200 , message, orders)
    } catch (error) {
        return response.sendResponse(res, 500 , err.message)
    }
});

module.exports = router;