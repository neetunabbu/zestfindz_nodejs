// src/routes/api/v1/rest.routes.js
const express = require('express');
const { Setting, Language, Currency } = require('../../../models');
const settingController = require('../../../controllers/settingController');

const router = express.Router();



router.get('/translations/paginate', settingController.translationsPaginate);

// GET /api/v1/rest/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error('GET /rest/settings error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch settings' });
  }
});

// GET /api/v1/rest/languages/active
router.get('/languages/active', async (req, res) => {
  try {
    const langs = await Language.findAll({ where: { status: 1 } });
    return res.json({ success: true, data: langs });
  } catch (err) {
    console.error('GET /rest/languages/active error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch languages' });
  }
});

// GET /api/v1/rest/currencies/active
router.get('/currencies/active', async (req, res) => {
  try {
    const currs = await Currency.findAll({ where: { status: 1 } });
    return res.json({ success: true, data: currs });
  } catch (err) {
    console.error('GET /rest/currencies/active error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch currencies' });
  }
});

// GET /api/v1/rest/countries
// router.get('/countries', async (req, res) => {
//   try {
//     const { has_price, country_id } = req.query;
//     const where = {};
//     if (has_price === 'true') where.has_price = true;
//     if (country_id) where.id = country_id;
//     const countries = await Country.findAll({ where });
//     return res.json({ success: true, data: countries });
//   } catch (err) {
//     console.error('GET /rest/countries error:', err);
//     return res.status(500).json({ success: false, message: 'Could not fetch countries' });
//   }
// });

module.exports = router;
