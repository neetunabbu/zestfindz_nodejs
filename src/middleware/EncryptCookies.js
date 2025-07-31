const crypto = require('crypto');

// List of cookie names that should NOT be encrypted
const exceptCookies = [
  // Add cookie names here you want to exclude from encryption
];

const secret = process.env.COOKIE_SECRET || 'your-secret-key'; // Replace with env var in real app

function encrypt(value) {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(value) {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', secret);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return value; // If decryption fails, return raw value
  }
}

const EncryptCookies = (req, res, next) => {
  // Decrypt incoming cookies
  if (req.cookies) {
    for (const [key, value] of Object.entries(req.cookies)) {
      if (!exceptCookies.includes(key)) {
        req.cookies[key] = decrypt(value);
      }
    }
  }

  // Override res.cookie to encrypt cookies before sending
  const originalCookie = res.cookie.bind(res);
  res.cookie = (name, value, options) => {
    if (!exceptCookies.includes(name) && typeof value === 'string') {
      value = encrypt(value);
    }
    return originalCookie(name, value, options);
  };

  next();
};

module.exports = EncryptCookies;
