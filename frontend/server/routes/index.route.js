const router = require("express").Router();

// router.use("/api/laptop/", require("./apis/laptop.route"));
router.use("/api/cart/", require("./apis/cart.route"));
router.use("/api/comment/", require("./apis/comment.route"));
router.use("/api/order/", require("./apis/order.route"));
router.use("/api/chat/", require("./apis/chat.route"));
router.use("/api/analytics/", require("./apis/utils.route"));
router.use("/api/blog/", require("./apis/blog.route"));
router.use("/api/sku/", require("./apis/spec.route"))
router.use("/api/product", require("./apis/product.route"))

module.exports = router;
