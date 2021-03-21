const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth.js");

const ProductsController = require("../controllers/products.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); //store the file
  } else {
    //reject the file
    cb(new Error("File is not accepted"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5 MBs size limit
  },
  fileFilter: fileFilter,
});

// Products handler
router.get("/", ProductsController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImg"),
  ProductsController.products_create_product
);

// Singular Product handler
router.get("/:productId", ProductsController.products_get_product);

router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_product
);

router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

module.exports = router;
