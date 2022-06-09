const mongoose = require("mongoose");

let categorySchema = new mongoose.Schema({
    name: { type: String, require: true },
    unsignedName: { type: String, require: true },
    subCategory: { type: mongoose.Types.ObjectId, ref: "Category" }
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
