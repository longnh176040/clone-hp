const mongoose = require("mongoose");
const mongooseAlgolia = require("mongoose-algolia");

let laptopsSchema = new mongoose.Schema({
  laptop_id: { type: String },
  brand: { type: String },
  name: { type: String },
  series: { type: String, toLowerCase: true },
  CPU: {
    name: { type: String },
    speed: { type: String },
    cache: { type: String },
  },
  RAM: {
    capacity: { type: String },
    socket_number: { type: String },
  },
  storage: { type: String },
  display: { type: String },
  graphic: { type: String },
  wireless: { type: String },
  LAN: { type: String },
  connection: {
    USB: { type: String },
    HDMI_VGA: { type: String },
  },
  keyboard: { type: String },
  webcam: { type: String },
  audio: { type: String },
  battery: { type: String },
  OS: { type: String },
  dimension: { type: String },
  weight: { type: String },
  color: [{ type: String }],
  security: { type: String },
  price: { type: Number },
  sale: { type: Number },
  status: { type: Boolean },
  thumbnails: [{ type: String }],
  // tương tác
  interaction: {
    rating_point: { type: Number, default: 5 },
    rates: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  filter: { type: mongoose.Types.ObjectId, ref: "Filter" },
});

laptopsSchema.plugin(mongooseAlgolia, {
  appId: "MLKSBRTZ0H",
  apiKey: "d50250b74183352f94c94ea59bdc5966",
  indexName: "Support HP", 
  selector: "_id brand name series laptop_id filter thumbnails CPU.name graphic RAM.capacity sale price status display",
  populate: {
    path: "filter",
    select: "ram need screen_resolution screen_size cpu hard_drive vga os storage price_range",
  },
  defaults: {
    author: "unknown",
  },
  debug: true,
});

let Laptop = mongoose.model("Laptop", laptopsSchema);
Laptop.SyncToAlgolia();
Laptop.SetAlgoliaSettings({
  searchableAttributes: ["_id", "brand", "name", "series", "filter.slug"],
});
module.exports = Laptop;