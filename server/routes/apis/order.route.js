const router = require("express").Router();

const controller = require("../../controllers/order.controller");

router.post("/", controller.createOrder);
router.post("/coverage", controller.createCoverage);
router.get("/", controller.getOrders);


router.get("/coverage", controller.getCoverage);
router.get("/:coverageId", controller.getOrdersById);
router.get("/coverage/:coveragePhone", controller.getCoverageStatusByPhone);
router.put("/coverage/:coveragePhone", controller.updateCoverageStatusByPhone);

module.exports = router;
