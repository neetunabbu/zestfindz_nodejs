// src/utils/uploadToS3Buffer.js
const fs = require('fs');
const { Upload } = require('@aws-sdk/lib-storage');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

const uploadToS3Buffer = async (buffer, originalname, mimetype, folder = '') => {
  const key = `${folder}${Date.now()}-${originalname}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read', 
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = uploadToS3Buffer;
