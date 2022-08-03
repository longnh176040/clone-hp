const AWS = require("aws-sdk");

const BUCKET_NAME = "anhquynh.name.vn";

const s3Config = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
  Bucket: BUCKET_NAME
});

module.exports = {BUCKET_NAME, s3Config}
