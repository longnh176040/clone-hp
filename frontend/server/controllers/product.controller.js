const { RESPONSE_MESSAGES, MESSAGE_KEYS, MESSAGE_VALUES } = require("../utils/message");
const { removeVietnameseTones } = require("../utils/string");
const Filter = require("../models/filter");
const Product = require("../models/product");
const Blog = require("../models/blog");

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
        product_id: unsignedName,
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
        size_range: req.body.size_range,
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
        GPU: req.body.gpu,
        GPS: req.body.gps,
        bluetooth: req.body.bluetooth,
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

    await filterData.save();
    await product.save();
    return res.status(201).json({ msg: RESPONSE_MESSAGES.CREATE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product.toLowerCase()) });
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
        product_id: unsignedName,
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
        size_range: req.body.size_range,
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
        GPU: req.body.gpu,
        GPS: req.body.gps,
        bluetooth: req.body.bluetooth,
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
    const product = await Product.findOneAndDelete({ _id: id });
    await Filter.deleteOne({ _id: product.filter });
    await Blog.deleteOne({ belong_to: product._id });
    if (!product) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }
    product.RemoveFromAlgolia();
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
    const product = await Product.findOne({
        _id: id,
      });
    const blog = await Blog.findOne(
        { belong_to: id },
        "content"
      );
    if (!product) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }
    return res.status(200).json({product: product, blog: blog});
}

exports.getEditProductById = async ( req, res ) => {
    const { id } = req.params;
    const product = await Product.findOne({
        _id: id,
      });
    if (!product) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }
    return res.status(200).json(product);
}


exports.getProductsByIds = async (req, res, next) => {
    try {
      products = await Product.find({ _id: { $in: req.body.id } });
      products = products.map((product, index) => {
        return {
          amount: req.body.amount[index],
          ram: product.ram,
          color: product.color,
          thumbnails: product.imageUrls,
          product_id: product.product_id,
          brand: product.brand,
          name: product.name,
          series: product.series,
          storage: product.storage,
          display: product.display,
          camera: product.camera,
          webcam: product.webcam,
          audio: laptop.audio,
          battery: product.battery,
          OS: product.OS,
          price: product.price,
          sale: product.sale,
          status: product.status,
          GPU: product.gpu,
          GPS: product.gps,
          bluetooth: product.bluetooth,
          dimension: product.dimension,
          weight: product.weight,
          chipset: product.chipset,
          sim: product.sim,
          screen_size: product.screen_size,
          screen_resolution: product.screen_resolution,
        };
      });
      return res.status(200).json(products);
    } catch (err) {
      return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.product) })
    }
  };

exports.changeStatus = async (req, res) => {
      const product = await Product.findOneAndUpdate(
        { _id: req.query.id },
        { status: req.query.value },
        { new: true }
      );
      if(!product){
        return res.status(500).json({ msg: RESPONSE_MESSAGES.UPDATE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.status)  })
      }
      product.SyncToAlgolia();
      return res.status(200).json({ msg: "Cập nhật thành công" });
};
