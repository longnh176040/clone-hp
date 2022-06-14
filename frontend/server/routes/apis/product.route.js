const router = require("express").Router();

const productController = require("../../controllers/product.controller");

router.get('/', productController.getListProduct);
router.get("/:id", productController.getProductById);
router.post("/rating", productController.rating)
router.post("/", productController.createProduct);
router.put("/", productController.editProduct);
router.delete("/", productController.deleteProduct);

module.exports = router;
