const { RESPONSE_MESSAGES, MESSAGE_KEYS, MESSAGE_VALUES } = require("../utils/message");
const { removeVietnameseTones } = require("../utils/string");
const Filter = require("../models/filter");
const Product = require("../models/product");
const Laptop = require("../models/product");

exports.createProduct = async ( req, res ) => {
    const { imageUrls, name, filter, brand, series, specification } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.FIELD_REQUIRED.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.imageProductUrls) });
    }

    const unsignedName = removeVietnameseTones(name).trim().replace(" ", "-");
    const filterData = new Filter({
        need: filter.need,
        cpu: filter.cpu,
        ram: filter.ram,
        storage: filter.storage,
        vga: filter.vga,
        screen_size: filter.screen_size,
        screen_resolution: filter.screen_resolution,
        os: filter.os,
        price_range: filter.price_range,
    });

    const product = new Laptop({
        laptop_id: unsignedName,
        brand: brand,
        name,
        series: series,
        CPU: {
            name: req.body.CPU_name,
            speed: req.body.CPU_speed,
            cache: req.body.CPU_cache,
        },
        RAM: {
            capacity: req.body.RAM_capacity,
            socket_number: req.body.RAM_socket_number,
        },
        storage: req.body.storage,
        display: req.body.display,
        graphic: req.body.graphic,
        wireless: req.body.wireless,
        LAN: req.body.LAN,
        connection: {
            USB: req.body.connection_USB,
            HDMI_VGA: req.body.connection_HDMI_VGA,
        },
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
        specification
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
        need: filter.need,
        cpu: filter.cpu,
        ram: filter.ram,
        storage: filter.storage,
        vga: filter.vga,
        screen_size: filter.screen_size,
        screen_resolution: filter.screen_resolution,
        os: filter.os,
        price_range: filter.price_range,
    };

    const updateData = {
        laptop_id: unsignedName,
        brand,
        name,
        series,
        imageUrls,
        specification,
        CPU: {
            name: req.body.CPU_name,
            speed: req.body.CPU_speed,
            cache: req.body.CPU_cache,
        },
        RAM: {
            capacity: req.body.RAM_capacity,
            socket_number: req.body.RAM_socket_number,
        },
        storage: req.body.storage,
        display: req.body.display,
        graphic: req.body.graphic,
        wireless: req.body.wireless,
        LAN: req.body.LAN,
        connection: {
            USB: req.body.connection_USB,
            HDMI_VGA: req.body.connection_HDMI_VGA,
        },
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

exports.getListProduct = async (req, res) => {
    const products = await Product.find();
    return res.status(200).json(products);
}

exports.getProductById = async (req ,res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }

    return res.status(200).json(product);
}
