import { v4 as uuidv4 } from 'uuid';
const Ticket = require('../../models/Ticket');
import ModelLogService from '../../services/ModelLogService/ModelLogService.js';

class TicketEvents {
  static async creating(ticket) {
    ticket.uuid = uuidv4();
  }

  static async created(ticket) {
    const logService = new ModelLogService();
    await logService.logging(ticket, ticket, 'created');
  }

  static async updated(ticket) {
    const logService = new ModelLogService();
    await logService.logging(ticket, ticket, 'updated');
  }

  static async deleted(ticket) {
    const logService = new ModelLogService();
    await logService.logging(ticket, ticket, 'deleted');
  }

  static async restored(ticket) {
    const logService = new ModelLogService();
    await logService.logging(ticket, ticket, 'restored');
  }
}

export default TicketEvents;
