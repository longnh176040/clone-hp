const mongoose = require("mongoose");
const mongooseAlgolia = require("mongoose-algolia");

let productSchema = new mongoose.Schema({
    product_id: { type: String },
    brand: { type: String },
    name: { type: String },
    series: { type: String, toLowerCase: true },
    chipset: { type: String },
    ram: { type: String },
    storage: { type: String },
    sim: { type: String },
    wifi: { type: String },
    screen_size: { type: String },
    screen_resolution: { type: String },
    size_range: { type: String },
    price_range: { type: String },
    camera: {type: String},    
    webcam: { type: String },
    display: { type: String },
    graphic: { type: String },
    wireless: { type: String },
    GPS: { type: String },
    GPU: { type: String },
    bluetooth: { type: String },
    LAN: { type: String },
    keyboard: { type: String },
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
    imageUrls: [{ type: String }],
    // tương tác
    interaction: {
        rating_point: { type: Number, default: 5 },
        rates: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    },
    filter: { type: mongoose.Types.ObjectId, ref: "Filter" },
    // specification:
    //     {
    //         skus: [
    //             {
    //                 type: { type: mongoose.Types.ObjectId, ref: "Specification" },
    //                 value: { type: String }
    //             }
    //         ],
    //         price: { type: Number, required: true },
    //         salePrice: { type: Number, required: true },
    //         amount: { type: Number, required: true },
    //         isAvailable: { type: Boolean, default: true }
    //     },
    saleAmount: { type: Number, default: 0 },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

productSchema.plugin(mongooseAlgolia, {
    appId: "FKYKG6XW0M",
    apiKey: "a2329f11e8a305675fdcb4b9c7e1851a",
    indexName: "products",
    selector: "id brand name product_id filter imageUrls sale price status chipset ram OS",
    populate: {
        path: "filter",
        select: "ram sim brand size_range storage OS price_range",
    },
    defaults: {
        author: "unknown",
    },
    debug: true,
});


const Product = mongoose.model("Product", productSchema);
Product.SyncToAlgolia();
Product.SetAlgoliaSettings({
    searchableAttributes: ["ram", "brand", "OS", "sim", "storage"],
});
module.exports = Product;
