const AWS = require("aws-sdk");

const ID = "AKIA3S6P576Y4AQIJW4U";
const SECRET = "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";
const BUCKET_NAME = "anhquynh.name.vn";

const s3Config = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  Bucket: BUCKET_NAME
});

module.exports = {BUCKET_NAME, s3Config}
