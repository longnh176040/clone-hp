const router = require("express").Router();

const controller = require("../../controllers/utils.controller")

router.get("/auth", controller.generateGoogleAccessToken);

module.exports = router;