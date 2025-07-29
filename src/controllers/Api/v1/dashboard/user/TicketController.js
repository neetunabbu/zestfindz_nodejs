// src/controllers/v1/dashboard/user/ticketController.js

import { Ticket } from '../../../../../models/Ticket';
import { TicketRepository } from '../../../../../repositories/TicketRepository';
import { TicketService } from '../../../../../services/TicketService';
import { successResponse, errorResponse } from '../../../../../utils/ApiResponse';

export const ticketController = {
  async paginate(req, res) {
    try {
      const filter = {
        ...req.query,
        created_by: req.user.id,
      };

      const tickets = await TicketRepository.paginate(filter);
      return res.json(successResponse('Success', tickets));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to fetch tickets', error));
    }
  },

  async store(req, res) {
    try {
      const payload = {
        ...req.body,
        created_by: req.user.id,
      };

      const result = await TicketService.create(payload);

      if (!result.status) {
        return res.status(400).json(errorResponse(result.message));
      }

      return res.json(successResponse('Ticket created successfully', result.data));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to create ticket', error));
    }
  },

  async show(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id);

      if (!ticket || ticket.created_by !== req.user.id) {
        return res.status(404).json(errorResponse('Ticket not found'));
      }

      return res.json(successResponse('Success', ticket));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to fetch ticket', error));
    }
  },

  async update(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id);

      if (!ticket || ticket.created_by !== req.user.id) {
        return res.status(404).json(errorResponse('Ticket not found'));
      }

      const payload = {
        ...req.body,
        created_by: req.user.id,
      };

      const result = await TicketService.update(ticket, payload);

      if (!result.status) {
        return res.status(400).json(errorResponse(result.message));
      }

      return res.json(successResponse('Ticket updated successfully', result.data));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to update ticket', error));
    }
  },
};
