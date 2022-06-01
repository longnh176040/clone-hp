const multer = require("multer");
const unidecode = require("unidecode");
const multerS3 = require("multer-s3");
const s3 = require("../configs/s3.conf");

var extension;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/svg+xml": "svg+xml",
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Local only

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "backend/images");
//   },
//   filename: (req, file, cb) => {
//     const decodedName = unidecode(file.originalname);
//     var name = decodedName.toLowerCase().split(" ").join("-");
//     const extension = MIME_TYPE_MAP[file.mimetype];
//     cb(null, images / name + "-" + Date.now() + "." + extension);
//   },
// });

const multerS3Config = multerS3({
  s3: s3.s3Config,
  bucket: s3.BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    var destination;
    extension = MIME_TYPE_MAP[file.mimetype];
    if (file.fieldname == "laptop") {
      destination =
        req.body.prefix +
        "/" +
        req.body.product_type +
        "/" +
        req.body.brand +
        "/" +
        req.body.series +
        "/" +
        req.body.laptop_id +
        "/";
    }
    cb(
      null,
      destination + req.body.laptop_id + "-" + Date.now() + "." + extension
    );
  },
  contentDisposition: "inline",
  signatureVersion: "v4",
  contentType: function (req, file, cb) {
    cb(null, `image/${extension}`);
  },
});

const upload = multer({
  storage: multerS3Config,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20, // we are allowing only 10 MB per file
  },
});

module.exports = upload;
