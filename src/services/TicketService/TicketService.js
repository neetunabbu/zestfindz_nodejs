const ResponseError = require('../constants/responseError');
const Ticket = require('../models').Ticket;

class TicketService {
  async create(data) {
    try {
      const ticket = await Ticket.create(data);
      return { status: true, code: ResponseError.NO_ERROR, data: ticket };
    } catch (error) {
      return { 
        status: false, 
        code: ResponseError.ERROR_501, 
        message: error.message 
      };
    }
  }

  async update(ticket, data) {
    try {
      await ticket.update(data);
      return { status: true, code: ResponseError.NO_ERROR, data: ticket };
    } catch (error) {
      console.error(error);
      return { 
        status: false, 
        code: ResponseError.ERROR_502, 
        message: 'Ticket update failed' 
      };
    }
  }

  async setStatus(id, status) {
    try {
      const ticket = await Ticket.findByPk(id);
      
      if (!ticket) {
        return { status: false, code: ResponseError.ERROR_404 };
      }

      const newStatus = status || ticket.status;
      
      if (!Ticket.STATUS.includes(newStatus)) {
        return { 
          status: false, 
          code: ResponseError.ERROR_253, 
          message: 'Invalid status value' 
        };
      }

      await ticket.update({ status: newStatus });
      return { status: true, code: ResponseError.NO_ERROR, data: ticket };
    } catch (error) {
      console.error(error);
      return { 
        status: false, 
        code: ResponseError.ERROR_502, 
        message: 'Status update failed' 
      };
    }
  }
}

module.exports = new TicketService();