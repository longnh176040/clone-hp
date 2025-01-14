const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
    user_id: { type: String },
    products: [
        {
            productId: { type: mongoose.Types.ObjectId, ref: "Product" },
            price: { type: Number },
            sku: { type: String },
            amount: { type: Number },
        }
    ],
    username: { type: String },
    phone: { type: String },
    address: { type: String },
    message: { type: String },
    delivery_method: { type: String, default: "cod" },
    payment_method: { type: String },
    total_price: { type: Number },
    created_at: { type: String },
    created_time_stamp: { type: Number },
    order_id: { type: String },
    status: { type: Boolean, default: false }
});

module.exports = mongoose.model("Order", orderSchema);
