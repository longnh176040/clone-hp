const mongoose = require("mongoose");

const filterSchema = mongoose.Schema({
  need: {
    type: String,
  },
  cpu: {
    type: String,
  },
  ram: {
    type: String,
  },
  storage: {
    type: String,
  },
  vga: {
    type: String,
  },
  screen_size: {
    type: String,
  },
  screen_resolution: {
    type: String,
  },
  os: {
    type: String,
  },
  price_range: {
    type: String,
  },
});

module.exports = mongoose.model("Filter", filterSchema);
