const mongoose = require("mongoose");

const filterSchema = mongoose.Schema({
    ram: {
        type: String,
    },
    storage: {
        type: String,
    },
    os: {
        type: String,
    },
    price_range: {
        type: String,
    },
    brand: { type: String },
    sim: { type: String },
    size_range: { type: String }
});

module.exports = mongoose.model("Filter", filterSchema);
