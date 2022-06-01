const router = require("express").Router();

const laptopController = require("../../controllers/laptop.controller");
const upload = require("../../middlewares/upload");

// Get all laptops
router.get("/", laptopController.getLaptops);

// Get latops by Id
router.post("/many/by-id", upload.fields([]), laptopController.getLaptopsByIds);

// Rating
router.get("/rating", laptopController.rating);

// Get individual laptop
router.get("/:laptop_id", laptopController.getLaptop);

// Create Laptop
router.post(
  "/",
  upload.fields([{ name: "laptop" }]),
  laptopController.createlaptop
);

// Remove thumbnails
router.put("/image", laptopController.removeImageThumbnails);

// Add more thumbnails
router.put(
  "/add/image",
  upload.fields([{ name: "laptop" }]),
  laptopController.addImageThumbnails
);

// Delete latop
router.delete("/:laptop_id", laptopController.removeLaptop);

// Edit laptop
router.put("/:laptop_id", upload.fields([]), laptopController.editLaptop);

// Change status
router.get("/change/status", laptopController.changeStatus);

module.exports = router;
