const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    name: {type: String, require: true},
    price: {type: Number, require: true},
    image: { type: String, require: true },
    quantity: {type: Number, require: true},
    productOwner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
},{
    timestamps: true
})

module.exports = mongoose.model('product', productSchema)
