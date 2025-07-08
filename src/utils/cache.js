// src/utils/cache.js

const cache = new Map();

const set = (key, value, ttl = 3600) => {
  const expires = Date.now() + ttl * 1000;
  cache.set(key, { value, expires });
};

const get = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expires) {
    cache.delete(key); // remove expired
    return null;
  }

  return cached.value;
};

const has = (key) => {
  return get(key) !== null;
};

const del = (key) => {
  cache.delete(key);
};

const clear = () => {
  cache.clear();
};

module.exports = {
  set,
  get,
  has,
  del,
  clear
};
