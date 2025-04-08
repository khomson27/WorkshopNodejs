const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema({
    productId: {type: Schema.Types.ObjectId, ref: 'product', required: true},
    quantity: {type: Number, required: true}
},{
    timestamps: true
})

module.exports = mongoose.model('order', orderSchema)
