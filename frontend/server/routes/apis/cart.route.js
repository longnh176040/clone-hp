const router = require("express").Router();
const upload = require("../../middlewares/upload");

const cartController = require("../../controllers/cart.controller");

router.get("/:id", cartController.getCart);
router.post("/", upload.fields([]), cartController.addItem);
router.put("/", upload.fields([]), cartController.decreaseItemAmount);
router.put("/item", upload.fields([]), cartController.deleteItemInCart);

module.exports = router;
