const s3 = require("../configs/s3.conf");

exports.deleteS3Object = (objects) => {
  var params = {
    Bucket: s3.BUCKET_NAME,
    Delete: {
      Objects: objects,
    },
  };

  s3.s3Config.deleteObjects(params, function (err, data) {
    // if (err) console.log(err, err.stack);
  });
};
