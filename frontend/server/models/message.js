const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  uid: { type: String },
  content: String,
  username: String,
  created_at: String,
  isSeen: { type: Boolean, default: false },
  room_id: String
});

module.exports = mongoose.model("Message", messageSchema);
