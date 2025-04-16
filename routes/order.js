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

/* Put orders */
router.put('/', [middleware], async function(req, res, next) {
    let { orderIds } = req.body

    console.log("orderIds: ", orderIds)

    try {
        const orders = await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { isPaid: true } }
        );  
        message="แก้ไขสถานะการชำระเงินสำเร็จ"
        return response.sendResponse(res, 200 , message, orders)
    }catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
})

/* Delete order */
router.delete('/:orderId', [middleware], async function (req, res, next) {
    let { orderId } = req.params
    try {
        const order = await Order.findOne({ _id: orderId });
        await Order.findByIdAndDelete(orderId);
        const product = await Product.findOne({ _id: order.productId });
        productDetail = {}
        productDetail.quantity = product.quantity + order.quantity
        await Product.findByIdAndUpdate(order.productId, productDetail, {new: true})
        message=`ลบข้อมูล order id: ${orderId} สำเร็จ`
        return response.sendResponse(res, 200 , message)
    } catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
});

module.exports = router;