const mongoose = require("mongoose");

const productModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, require: true }
});

module.exports = mongoose.model("Product", productModel);