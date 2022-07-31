const AWS = require("aws-sdk");

const ID = "AKIA3S6P576YXOQDOU5E";
const SECRET = "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";
const BUCKET_NAME = "hp.minastik.com";

const s3Config = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  Bucket: BUCKET_NAME
});

module.exports = {BUCKET_NAME, s3Config}
