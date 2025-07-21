const fs = require('fs');
const { Upload } = require('@aws-sdk/lib-storage');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

const uploadToS3 = async (filePath, key, contentType = 'application/octet-stream') => {
  const fileStream = fs.createReadStream(filePath);

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ACL: 'public-read',
      ContentType: contentType,
    },
  });

  await upload.done();

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = uploadToS3;

