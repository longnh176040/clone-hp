const mongoose = require("mongoose");

let cartsSchema = new mongoose.Schema({
  user_id: { type: String },
  products: [
    {
      product_id: { type: String },
      amount: { type: String },
    },
  ],
});

module.exports = mongoose.model("Cart", cartsSchema);
