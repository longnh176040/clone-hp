const router = require("express").Router();
const specificationController = require("../../controllers/specification.controller");

router.get("/", specificationController.getAllSpecs);
router.get("/:code", specificationController.getSpecDetail);
router.post("/", specificationController.createSpec);
router.put("/", specificationController.editSpec);
router.delete("/:code", specificationController.deleteSpec);

module.exports = router;
