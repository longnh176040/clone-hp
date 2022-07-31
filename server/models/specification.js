const mongoose = require("mongoose");

let specificationSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, require: true },
    unsignedName: { type: String, require: true },
    value: { type: String, require: true }
});

const Specific = mongoose.model("Specification", specificationSchema);
module.exports = Specific;
