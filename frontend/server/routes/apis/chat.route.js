const router = require("express").Router();

const controller = require("../../controllers/chat.controller");

router.post("/", controller.sendMessage);
router.get("/", controller.getMessageByUser);

module.exports = router;
