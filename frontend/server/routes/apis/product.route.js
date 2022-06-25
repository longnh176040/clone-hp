const router = require("express").Router();

const productController = require("../../controllers/product.controller");



router.post("/rating", productController.rating)
router.post("/", productController.createProduct);
router.post("/many/by-id", productController.getProductsByIds);
router.put("/", productController.editProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/change/status", productController.changeStatus);
router.get("/edit/:id", productController.getEditProductById);
router.get("/:id", productController.getProductById);
router.get('/', productController.getListProduct);


module.exports = router;
