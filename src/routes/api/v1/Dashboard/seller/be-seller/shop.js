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
const { randomBytes } = require('crypto');
const moment = require('moment-timezone');
const { getGeocodedLocation } = require('../../../../../../services/googleService');

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
  '/create-shop-seller',
  verifyToken,
  upload.fields([
    { name: 'logo_image', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.user_id;

      const {
        title,
        description,
        address,
        lat,
        long,
      } = req.body;

      if (!title || !description || !address || !lat || !long) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const logoFile = req.files.logo_image?.[0];
      const bannerFile = req.files.banner_image?.[0];

      if (!logoFile || !bannerFile) {
        return res.status(400).json({ message: 'Missing image files' });
      }

      const logoIMGPATH = await uploadToS3(logoFile, 'bank_docs/');
      const bannerIMGPATH = await uploadToS3(bannerFile, 'bank_docs/');


      const shopData = {
        user_id: userId,
        uuid: require('uuid').v4(),
        application_id: `APP-${randomBytes(4).toString('hex')}`,
        logo_img: logoIMGPATH,
        background_img: bannerIMGPATH,
        lat_long: {
          lat,
          lng: long,
        },
        tax: 18,
        delivery_time: 18,
        min_amount: 100,
        updated_at: moment().tz('Asia/Kolkata').toDate(),
      };

      const [shop, created] = await db.Shop.findOrCreate({
        where: { user_id: userId },
        defaults: shopData
      });

      if (!created) {
        await shop.update(shopData);
      }

      const newShop = await db.Shop.findOne({ where: { user_id: userId } });


      await db.ShopTranslation.upsert(
        {
          shop_id: newShop.id,
          title,
          description,
          address,
          locale: 'en',
        },
        {
          conflictFields: ['shop_id','locale'], 
        }
      );


      const latitude = newShop.lat_long.lat;
      const longitude = newShop.lat_long.lng;


      const geocodedData = await getGeocodedLocation(latitude, longitude);

      if (!geocodedData) {
        return res.status(500).json({ message: 'Failed to fetch location from Google Maps API' });
      }

      console.log(".............",geocodedData);
      

      const [shopLocation, createdShopLocation] = await db.ShopLocation.upsert(
        {
          shop_id: newShop.id,
          zipcode: geocodedData.zipcode || '',
          region_id: 1,
          city_id: 1,
          country_id: 1,
          area_id: 1,
          city: geocodedData.city || '',
          state: geocodedData.state || '',
          country: geocodedData.country || '',
          district: geocodedData.district || '',
          location: geocodedData.locality || ''
        },
        {
          conflictFields: ['shop_id'],
          returning: true
        }
      );


      res.status(201).json({
        success: true,
        message: 'Shop created successfully',
        data: {
          shop: newShop,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
