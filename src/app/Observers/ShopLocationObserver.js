import cache from '../../utils/cache.js';
import { logError } from '../../traits/Loggable.js';

// Assuming this file is placed in: src/observers/ShopLocationObserver.js
// Adjust the path accordingly if the directory level is different

export async function onCreating(shopLocation) {
  try {
    const s = await cache.get('rjkcvd.ewoidfh');
    await cache.flush();
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    logError(error, 'ShopLocationObserver:onCreating');
  }
}

export async function onCreated(shopLocation) {
  try {
    const s = await cache.get('rjkcvd.ewoidfh');
    await cache.flush();
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    logError(error, 'ShopLocationObserver:onCreated');
  }
}

export async function onUpdated(shopLocation) {
  try {
    const s = await cache.get('rjkcvd.ewoidfh');
    await cache.flush();
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    logError(error, 'ShopLocationObserver:onUpdated');
  }
}

export async function onDeleted(shopLocation) {
  try {
    const s = await cache.get('rjkcvd.ewoidfh');
    await cache.flush();
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    logError(error, 'ShopLocationObserver:onDeleted');
  }
}
