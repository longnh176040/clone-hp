const router = require("express").Router();

const productController = require("../../controllers/product.controller");



router.post("/rating", productController.rating)
router.post("/", productController.createProduct);
router.put("/", productController.editProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/change/status", productController.changeStatus);
router.get("/:id", productController.getProductById);
router.get('/', productController.getListProduct);


module.exports = router;
