const Order = require("../models/order");
const Coverage = require("../models/coverage");
const Cart = require("../models/cart");
const mailer = require("../utils/mailer");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.query.user;
    const order = new Order({
      user_id: userId,
      products: req.body.products,
      username: req.body.username,
      phone: req.body.phone,
      address: req.body.address,
      message: req.body.message,
      delivery_method: req.body.delivery_method,
      payment_method: req.body.payment_method,
      total_price: req.body.total_price,
      created_at: req.body.created_at,
      created_time_stamp: req.body.created_time_stamp,
      order_id: Math.random().toString(36).substring(6),
    });
    await order.save();
    const emailContent = `<div>username: ${req.body.username}</div><div>phone: ${req.body.phone}</div><div>price: ${req.body.total_price} vnđ</div>`;
    mailer.sendAnEmail(
      "ha.ln010399@gmail.com",
      "Đơn đặt hàng mới",
      emailContent
    );
    await Cart.deleteOne({ user_id: userId });
    return res.status(201).json({ msg: "Đặt hàng", order: order });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getOrdersById = async (req, res) => {
  try {
    const coverageId = req.params.coverageId;

    const coverage = await Order.findOne({ order_id: coverageId });
    return res.status(200).json(coverage);
  }catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


exports.createCoverage = async (req, res) => {
  try {
    const coverage = new Coverage({
      phone: req.body.coveragePhone,
      product: req.body.coverageProduct,
      date: req.body.coverageDate,
      reason: req.body.coverageReason,
      status: req.body.coverageStatus,
    });
    await coverage.save();
    return res.status(201).json({ msg: "Đặt bảo hành"});
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getCoverage = async (req, res) => {
  try {
    const coverage = await Coverage.find();
    return res.status(200).json(coverage);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getCoverageStatusByPhone = async (req, res) => {
  try {
    const coveragePhone = req.params.coveragePhone;
    const coverage = await Coverage.findOne({ phone: coveragePhone });
    return res.status(200).json(coverage);
  }catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
exports.updateCoverageStatusByPhone = async (req, res) => {
  try {
    const coveragePhone = req.params.coveragePhone;
    const coverage = await Coverage.findOne({ phone: coveragePhone });
    coverage.product = req.body.coverageProduct;
    coverage.date = req.body.coverageDate;
    coverage.reason = req.body.coverageReason;
    coverage.status = req.body.coverageStatus;
    await coverage.save();
    return res.status(200).json(coverage);
  }catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
