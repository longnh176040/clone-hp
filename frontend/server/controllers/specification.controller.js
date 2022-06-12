const Specification = require("../models/specification")
const { removeVietnameseTones } = require("../utils/string");
const { RESPONSE_MESSAGES, MESSAGE_KEYS, MESSAGE_VALUES } = require("../utils/message");

exports.getAllSpecs = async ( req, res, next ) => {
    const skus = await Specification.find({}, { code: 1, name: 1 });
    return res.status(200).json(skus);
}

exports.createSpec = async ( req, res ) => {
    const { name, value } = req.body;
    const unsignedName = removeVietnameseTones(name).trim();
    const existedName = await Specification.findOne({ unsignedName });
    if (existedName) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.EXISTED.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku) })
    }
    const code = Math.floor(Math.random() * 1000000).toString();
    const spec = new Specification({
        code,
        name,
        unsignedName,
        value
    });
    await spec.save();
    return res.status(201).json({ msg: RESPONSE_MESSAGES.CREATE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku.toLowerCase()) })
}

exports.editSpec = async ( req, res ) => {
    const { code, name, value } = req.body;
    const unsignedName = removeVietnameseTones(name).trim();
    const spec = await Specification.findOne({ code });
    if (!spec) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku) })
    }
    const existedName = await Specification.findOne({ unsignedName });
    if (existedName) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.EXISTED.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku) })
    }
    spec.name = name;
    spec.value = value;
    spec.unsignedName = unsignedName;
    await spec.save();
    return res.status(200).json({ msg: RESPONSE_MESSAGES.UPDATE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku.toLowerCase()) })
}

exports.getSpecDetail = async ( req, res ) => {
    const { code } = req.params;
    const spec = await Specification.findOne({ code }, { code: 1, name: 1, value: 1, unsignedName: 1 });
    if (!spec) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku) })
    }
    return res.status(200).json(spec);
}

exports.deleteSpec = async (req, res) => {
    const { code } = req.params;
    const spec = await Specification.deleteOne({ code });
    if (!spec.n || spec.n === 0 ) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.NOT_FOUND.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku) })
    }
    return res.status(200).json({ msg: RESPONSE_MESSAGES.DELETE_SUCCESS.replace(MESSAGE_KEYS.object, MESSAGE_VALUES.sku.toLowerCase()) });
}
