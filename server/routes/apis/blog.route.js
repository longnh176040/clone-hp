const router = require("express").Router();
const upload = require("../../middlewares/upload");

const blogController = require("../../controllers/blog.controller");

router.get("/:laptop_id", blogController.get);
router.post("/image", upload.single("image"), blogController.upload);
router.post("", blogController.create);
router.put("", blogController.edit);

module.exports = router;
