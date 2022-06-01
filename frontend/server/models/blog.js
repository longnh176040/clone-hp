const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  raw_content: {
    time: { type: Number },
    blocks: [
      {
        id: String,
        type: { type: String },
        data: {
          text: { type: String },
          level: { type: Number },
          file: {
            url: { type: String },
          },
          caption: { type: String },
          stretched: { type: Boolean },
          withBackground: { type: Boolean },
          withBorder: { type: Boolean },
          alignment: { type: String },
          style: { type: String },
          items: [{ type: String }],
          embed: String,
          height: Number,
          service: String,
          source: String,
          width: Number,
        },
      },
    ],
    version: { type: String },
  },
  content: { type: String, required: true, default: "<h3>Đánh giá sản phẩm đang được cập nhật</h3>" },
  belong_to: { type: String, required: true },
  created_at: String,
});

module.exports = mongoose.model("Blog", blogSchema);
