// resources/OrderStatusNoteResource.js

const moment = require('moment');
const OrderResource = require('./OrderResource');

class OrderStatusNoteResource {
  static toJson(orderStatusNote) {
    if (!orderStatusNote) return {};

    return {
      id: orderStatusNote.id ?? undefined,
      order_id: orderStatusNote.order_id ?? undefined,
      status: orderStatusNote.status ?? undefined,
      notes: orderStatusNote.notes ?? undefined,
      created_at: orderStatusNote.createdAt
        ? moment(orderStatusNote.createdAt).format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,
      updated_at: orderStatusNote.updatedAt
        ? moment(orderStatusNote.updatedAt).format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,

      // Relations
      order: orderStatusNote.order
        ? OrderResource.toJson(orderStatusNote.order)
        : undefined,
    };
  }

  // Optional: for collections
  static collection(orderStatusNotes = []) {
    return orderStatusNotes.map(note => this.toJson(note));
  }
}

module.exports = OrderStatusNoteResource;
