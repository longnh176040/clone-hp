const router = require("express").Router();

const controller = require("../../controllers/order.controller");

router.post("/", controller.createOrder);
router.get("/", controller.getOrders);
router.get("/confirm", controller.changeStatus);
router.delete("/:id", controller.deleteOrder);

router.post("/coverage", controller.createCoverage);
router.get("/coverage", controller.getCoverage);
router.get("/:coverageId", controller.getCovarageById);
router.get("/coverage/:coveragePhone", controller.getCoverageStatusByPhone);
router.put("/coverage/:id", controller.updateCoverageStatusById);

module.exports = router;
