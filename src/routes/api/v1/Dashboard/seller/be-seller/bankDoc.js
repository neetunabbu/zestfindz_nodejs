// routes/bankDoc.js
const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../../../../../config/s3');
const express = require('express');
const router = express.Router();
const upload = require('../../../../../../middleware/upload');
const db = require('../../../../../../models'); // Import the initialized models
const verifyToken = require('../../../../../../middleware/verifyToken');

const uploadToS3 = async (file, folder = '') => {
  const fileStream = fs.createReadStream(file.path);
  const fileKey = `${folder}${Date.now()}-${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};

router.post(
  '/upload-bank-doc',
  verifyToken,
  upload.fields([
    { name: 'cancel_cheque', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { account_number, ifsc_code } = req.body;
      const cancelCheque = req.files.cancel_cheque?.[0];
      const signature = req.files.signature?.[0];

      if (!account_number || !ifsc_code || !cancelCheque || !signature) {
        return res.status(400).json({
          message: 'All fields (account_number, ifsc_code, cancel_cheque, signature) are required.',
        });
      }

      const user_id = req.user?.user_id;

      console.log("................",user_id);
      
      

      const cancelChequeUrl = await uploadToS3(cancelCheque, 'bank_docs/');
      const signatureUrl = await uploadToS3(signature, 'bank_docs/');


      const [bankDoc, created] = await db.BankDoc.upsert({
        account_number,
        ifsc_code,
        user_id,
        cancel_cheque_url: cancelChequeUrl,
        signature_url: signatureUrl,
      }, {
        returning: true,
        conflictFields: ['user_id']
      });

      return res.status(created ? 201 : 200).json({
        success: true,
        message: created 
          ? 'Bank document uploaded successfully.' 
          : 'Bank document updated successfully.',
        data: bankDoc,
      });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// routes/bankDoc.js

router.get(
  '/get-bank-doc',
  verifyToken,
  async (req, res) => {
    try {
      const user_id = req.user?.user_id;

      if (!user_id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const bankDoc = await db.BankDoc.findOne({
        where: { user_id },
        attributes: ['account_number', 'ifsc_code', 'cancel_cheque_url', 'signature_url'],
      });

      if (!bankDoc) {
        return res.status(404).json({ success: false, message: 'Bank document not found' });
      }

      return res.status(200).json({
        success: true,
        data: bankDoc,
      });

    } catch (error) {
      console.error('Fetch bank doc error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


module.exports = router;