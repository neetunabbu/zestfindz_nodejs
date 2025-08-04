require('dotenv').config();
const db = require('../config/db'); // Your DB utility (e.g., Knex, Sequelize, etc.)
const axios = require('axios');
const dayjs = require('dayjs');
const { chunk } = require('lodash'); // for chunking arrays

class CalculateShopImageQualityScore {
  constructor(shopId) {
    this.shopId = shopId;
    this.API_KEY = process.env.OPENAI_API_KEY; // ✅ now using env variable
  }

  async handle() {
    try {
      const productsRaw = await db('products')
        .where({ shop_id: this.shopId })
        .whereNotNull('img')
        .select('id', 'img');

      const products = productsRaw.filter(p => this.isValidUrl(p.img));

      if (!products.length) {
        await db('shop_image_quality_scores').insert({
          shop_id: this.shopId,
          score: 0,
          breakdown: null,
          updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }).onConflict('shop_id').merge();

        console.info(`No valid product images found for shop ${this.shopId}`);
        return;
      }

      const batches = chunk(products, 5);
      let totalScore = 0;
      let imageCount = 0;

      for (const batch of batches) {
        const images = batch.map(product => ({
          type: 'image_url',
          image_url: { url: product.img },
        }));

        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-turbo',
            temperature: 0,
            top_p: 1,
            messages: [
              {
                role: 'system',
                content: 'You are a strict JSON formatter. Only return a JSON array of numeric scores like: [85, 90, 75]. Do not include explanations.',
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Rate these product images from 0 to 100 based on clarity, lighting, and composition. Respond ONLY with a JSON array like [85, 90, 70].',
                  },
                  ...images,
                ],
              },
            ],
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: `Bearer ${this.API_KEY}`,
            },
            timeout: 60000,
          }
        );

        const content = response?.data?.choices?.[0]?.message?.content ?? null;

        if (content) {
          let scores;

          try {
            scores = JSON.parse(content.trim());
          } catch (e) {
            console.error('Invalid JSON from OpenAI response:', content);
            return;
          }

          if (Array.isArray(scores) && scores.length === batch.length) {
            scores.forEach(score => {
              totalScore += Number(score);
              imageCount++;
            });
          } else {
            console.error('Score count mismatch or invalid format', { shopId: this.shopId, response: content });
            return;
          }
        } else {
          console.error('No content from OpenAI response', { shopId: this.shopId });
          return;
        }
      }

      const finalScore = imageCount > 0 ? +(totalScore / imageCount).toFixed(2) : 0;

      await db('shop_image_quality_scores').insert({
        shop_id: this.shopId,
        score: finalScore,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }).onConflict('shop_id').merge();

      console.info(`Image quality score calculated for shop ${this.shopId}: ${finalScore}`);

    } catch (err) {
      console.error('Exception calling OpenAI API', {
        shopId: this.shopId,
        error: err.message,
      });
    }
  }

  isValidUrl(str) {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }
}

module.exports = CalculateShopImageQualityScore;
