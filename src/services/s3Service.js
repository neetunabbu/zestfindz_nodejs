const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const fileName = `bank-documents/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = upload;
