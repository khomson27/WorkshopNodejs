var express = require('express');
var router = express.Router();
var Product = require('../models/product.model')
var User = require('../models/user.model');
var Order = require('../models/order.model');
var response = require('../utils/respones');
const middleware = require('../middleware/token.middleware');
const mongoose = require('mongoose')


/* GET product */
router.get('/', [middleware], async function(req, res, next) {
  
  let products = await Product.find({})

  return response.sendResponse(res, 200 , "" , products)

});

/* POST product */
router.post('/', [middleware], async (req, res) => {
    let {name , price, image, quantity} = req.body
    if (!name) {
        message="กรุณากรอก name"
        return response.sendResponse(res, 400 , message)
    }
    if (!price) {
        message="กรุณากรอก price"
        return response.sendResponse(res, 400 , message)
    }
    if (!image) {
        message="กรุณากรอก image"
        return response.sendResponse(res, 400 , message)
    }
    if (!quantity) {
        message="กรุณากรอก quantity"
        return response.sendResponse(res, 400 , message)
    }
    try {
        const product = await Product.create({ name, price, image, quantity, productOwner: req.userData.userId});
        message="สร้างสินค้าสำเร็จ"
        return response.sendResponse(res, 200 , message, product)
    } catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
});

/* PUT product */
router.put('/:productId', [middleware], async function(req, res, next) {
    let { productId } = req.params
    let {name , price, image, quantity} = req.body
    let productDetail = {}

    if (name) {
        productDetail.name = name
    }
    if (price) {
        productDetail.price = price
    }
    if (image) {
        productDetail.image = image
    }
    if (quantity) {
        productDetail.quantity = quantity
    }
    console.log(productDetail)
    try {
        let product = await Product.findByIdAndUpdate(productId,productDetail, {new: true})
        message="แก้ไขข้อมูลสินค้าสำเร็จ"
        return response.sendResponse(res, 200 , message, product)
    }catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
})

/* DELETE product */
router.delete('/:productId', [middleware], async function (req, res, next) {
    let { productId } = req.params
    try {
        await Product.findByIdAndDelete(productId, { productOwner: req.userData.userId});
        message=`ลบข้อมูลสินค้า id: ${productId} สำเร็จ`
        return response.sendResponse(res, 200 , message)
    } catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
});

/* GET product by id */
router.get('/:productId', [middleware], async (req, res, next) => {
    let { productId } = req.params
    console.log(productId)
    try {
      const product = await Product.findById(productId);
      if (product) { 
        message="ดึงข้อมูลสินค้าสำเร็จ"
        return response.sendResponse(res, 200 , message, product)
        }
        message="ไม่พบสินค้า"
        return response.sendResponse(res, 404 , message)

    } catch (err) {
        message="เกิดข้อผิดพลาดในก้าค้นหาสินค้า"
        return response.sendResponse(res, 500 , err.message)
    }
  });

  /* GET all order */
router.get('/:productId/orders', [middleware], async (req, res, next) => {
    let { productId } = req.params
    console.log(productId)
    try {
      const order = await Order.find({ productId: new mongoose.Types.ObjectId(productId) });
    console.log(order)
      if (order.length > 0) { 
        message=`ดึงข้อมูล order ของสินค้าชื่อ ${order[0].name} สำเร็จ`
        return response.sendResponse(res, 200 , message, order)
        }
        message=`ไม่พบ order ของสินค้า id: ${productId} `
        return response.sendResponse(res, 404 , message)

    } catch (err) {
        message="เกิดข้อผิดพลาดในก้าค้นหาสินค้า"
        return response.sendResponse(res, 500 , err.message)
    }
  });

  /* POST order in product || เพิ่มออเดอร์ใน product*/ 
  router.post('/:productId/orders', [middleware], async (req, res) => {
    let { productId } = req.params
    // console.log(productId)
    let { quantity } = req.body
    if (!productId) {
        message="กรุณากรอก productId"
        return response.sendResponse(res, 400 , message)
    }
    if (!quantity) {
        message="กรุณากรอก quantity"
        return response.sendResponse(res, 400 , message)
    }
    try {
        const currentProduct = await Product.findOne({_id: productId});
        if (currentProduct.quantity - quantity < 0){
            message=`สินค้าไม่เพียงพอ สินค้าเหลืออยู่จำนวน ${currentProduct.quantity} ชิ้น`
            return response.sendResponse(res, 400 , message)
        }
        const order = await Order.create({ productId, quantity});
        await Product.findByIdAndUpdate(productId,{quantity: currentProduct.quantity - quantity}, {new: true})
        message="สั่งออเดอร์สำเร็จ"
        return response.sendResponse(res, 200 , message, order)
    } catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
});

  module.exports = router;