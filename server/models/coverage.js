const mongoose = require("mongoose");

let coverageSchema = new mongoose.Schema({
  phone: { type: String },
  product: { type: String, require: true },
  date: { type: String },
  reason: { type: String },
  status: { type: String, default: "Chưa tiếp nhận"}
});

module.exports = mongoose.model("Coverage", coverageSchema);
