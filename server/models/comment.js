const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    created_at: { type: String },
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    replies: [
        {
            type: mongoose.Types.ObjectId, ref: "Comment"
        },
    ],
});

module.exports = mongoose.model("Comment", commentSchema);
