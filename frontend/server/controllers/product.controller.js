const { RESPONSE_MESSAGES, MESSAGE_KEYS, MESSAGE_VALUES } = require("../utils/message");
const { removeVietnameseTones } = require("../utils/string");
const Filter = require("../models/filter");
const Product = require("../models/product");

exports.createProduct = async ( req, res ) => {
    const { imageUrls,
        name,
        filter,
        brand,
        series,
        ram, chipset, storage, sim, wifi } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.FIELD_REQUIRED.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.imageProductUrls) });
    }

    const unsignedName = removeVietnameseTones(name).trim().replace(" ", "-");
    const filterData = new Filter({
        brand: filter.brand,
        ram: filter.ram,
        storage: filter.storage,
        os: filter.os,
        sim: filter.sim,
        price_range: filter.price_range,
        size_range: filter.size_range
    });

    const product = new Product({
        laptop_id: unsignedName,
        brand,
        name,
        series,
        chipset,
        ram,
        storage,
        sim,
        wifi,
        screen_size: req.body.screen_size,
        screen_resolution: req.body.screen_resolution,
        price_range: req.body.price_range,
        camera: req.body.camera,
        display: req.body.display,
        graphic: req.body.graphic,
        wireless: req.body.wireless,
        LAN: req.body.LAN,
        keyboard: req.body.keyboard,
        webcam: req.body.webcam,
        audio: req.body.audio,
        battery: req.body.battery,
        OS: req.body.OS,
        dimension: req.body.dimension,
        weight: req.body.weight,
        color: req.body.color,
        security: req.body.security,
        price: req.body.price,
        sale: req.body.sale,
        status: true,
        imageUrls,
        filter: filterData._id,
        // specification
    });

    await filter.save();
    await product.save();
    return res.status(201).json({ msg: RESPONSE_MESSAGES.FIELD_REQUIRED.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.imageProductUrls) });
}

exports.editProduct = async ( req, res ) => {
    const { imageUrls, name, filter, brand, series, specification, productId } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.FIELD_REQUIRED.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.imageProductUrls) });
    }

    const unsignedName = removeVietnameseTones(name).trim().replace(" ", "-");

    const filterData = {
        brand: filter.brand,
        ram: filter.ram,
        storage: filter.storage,
        os: filter.os,
        sim: filter.sim,
        price_range: filter.price_range,
        size_range: filter.size_range
    };

    const updateData = {
        laptop_id: unsignedName,
        brand,
        name,
        series,
        chipset: req.body.chipset,
        ram: req.body.ram,
        storage: req.body.storage,
        sim: req.body.sim,
        wifi: req.body.wifi,
        screen_size: req.body.screen_size,
        screen_resolution: req.body.screen_resolution,
        price_range: req.body.price_range,
        camera: req.body.camera,
        display: req.body.display,
        graphic: req.body.graphic,
        wireless: req.body.wireless,
        LAN: req.body.LAN,
        keyboard: req.body.keyboard,
        webcam: req.body.webcam,
        audio: req.body.audio,
        battery: req.body.battery,
        OS: req.body.OS,
        dimension: req.body.dimension,
        weight: req.body.weight,
        color: req.body.color,
        security: req.body.security,
        price: req.body.price,
        sale: req.body.sale,
        status: true,
        imageUrls,
        filter: filterData._id,
        // specification
    };

    await Filter.updateOne({ _id: filter._id }, filterData);
    await Product.updateOne({ _id: productId }, updateData);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.UPDATE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product.toLowerCase()) })
}

exports.deleteProduct = async ( req, res ) => {
    const { id } = req.params;
    const product = await Product.deleteOne({ _id: id });
    if (!product.n || product.n === 0) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }
    return res.status(200).json({ msg: RESPONSE_MESSAGES.DELETE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product.toLowerCase()) });
}

exports.rating = async ( req, res ) => {
    const { id, rating } = req.queryParams;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
        }
        const point = (product.interaction.rating_point + Number(rating)) / 2;
        product.interaction.rating_point = point.toFixed(1);
        product.interaction.rates = Number(product.interaction.rates) + 1;
        await product.save();
        return res.status(200).json({ msg: RESPONSE_MESSAGES.ACTION_SUCCESS.replace(MESSAGE_KEYS.action, MESSAGE_KEYS.rating) });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

exports.getListProduct = async ( req, res ) => {
    const products = await Product.find();
    return res.status(200).json(products);
}

exports.getProductById = async ( req, res ) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }

    return res.status(200).json(product);
}
