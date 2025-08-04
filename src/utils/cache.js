const cache = new Map();

const set = (key, value, ttl = 3600) => {
  const expires = Date.now() + ttl * 1000;
  cache.set(key, { value, expires });
};

const get = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }

  return cached.value;
};

const getCacheValue = get; // ✅ Alias

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
  getCacheValue, // ✅ Fix: Now it's exported properly
  has,
  del,
  clear
};
