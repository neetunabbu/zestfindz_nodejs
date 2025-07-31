import cache from '../../utils/cache.js';
import { logError } from '../../traits/Loggable.js';
import { Shop } from '../../models/Shop.js';
import { ModelLogService } from '../../services/ModelLogService/ModelLogService.js';
import db from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

class ShopObserver {
  // CREATING
  async creating(shop) {
    try {
      shop.uuid = uuidv4();
    } catch (error) {
      logError(error, 'ShopObserver:creating');
    }
  }

  // CREATED
  async created(shop) {
    try {
      const s = await cache.get('rjkcvd.ewoidfh');
      await cache.flush();
      await cache.set('rjkcvd.ewoidfh', s);
    } catch (error) {
      logError(error, 'ShopObserver:created - cache');
    }

    try {
      const modelLogger = new ModelLogService();
      await modelLogger.logging(shop, shop, 'created');
    } catch (error) {
      logError(error, 'ShopObserver:created - logging');
    }

    // Optional logic
    // const count = await Shop.count();
    // if (count >= 5) {
    //   await shop.destroy();
    // }
  }

  // UPDATED
  async updated(shop) {
    try {
      if (shop.status === 'approved') {
        if (!shop.seller?.hasRole('admin')) {
          await shop.seller?.syncRoles('seller');
        }

        await shop.seller?.invitations()?.destroy();
      }
    } catch (error) {
      logError(error, 'ShopObserver:updated - role/invitations');
    }

    try {
      const s = await cache.get('rjkcvd.ewoidfh');
      await cache.flush();
      await cache.set('rjkcvd.ewoidfh', s);
    } catch (error) {
      logError(error, 'ShopObserver:updated - cache');
    }

    try {
      const modelLogger = new ModelLogService();
      await modelLogger.logging(shop, shop, 'updated');
    } catch (error) {
      logError(error, 'ShopObserver:updated - logging');
    }
  }

  // DELETED
  async deleted(shop) {
    try {
      const s = await cache.get('rjkcvd.ewoidfh');
      await cache.flush();
      await cache.set('rjkcvd.ewoidfh', s);
    } catch (error) {
      logError(error, 'ShopObserver:deleted - cache');
    }

    try {
      await db('stories').where('shop_id', shop.id).del();
    } catch (error) {
      logError(error, 'ShopObserver:deleted - stories delete');
    }

    try {
      const modelLogger = new ModelLogService();
      await modelLogger.logging(shop, shop, 'deleted');
    } catch (error) {
      logError(error, 'ShopObserver:deleted - logging');
    }
  }
}

export default new ShopObserver();
