'use strict';

const { Op } = require('sequelize');
// Separate model imports (do not remove any)
const { Invitation } = require('../../models/Invitation');
const { User } = require('../../models/User');
const { Shop } = require('../../models/Shop');
const { Language } = require('../../models/Language');
const { Translation } = require('../../models/Translation');

// const { Op } = require('sequelize');

class InviteRepository {

  constructor(language = null) {
    this.language = language;
  }

  async paginate(filter = {}) {
    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;
    const sortColumn = filter.column || 'id';
    const sortDirection = filter.sort || 'DESC';

    const defaultLanguage = await Language.findOne({ where: { default: true } });
    const locale = defaultLanguage?.locale || 'en';

    const where = {}; // Add any filter conditions as needed

    const include = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname'],
        include: ['roles'] // assuming roles is a valid association
      },
      {
        model: Shop,
        as: 'shop',
        include: [
          {
            model: Translation,
            as: 'translation',
            where: this.language ? {
              [Op.or]: [
                { locale: this.language },
                { locale: locale }
              ]
            } : undefined,
            required: false
          }
        ]
      }
    ];

    return Invitation.findAndCountAll({
      where,
      include,
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [[sortColumn, sortDirection.toUpperCase()]]
    });
  }

  async show(invitationId) {
    const invitation = await Invitation.findByPk(invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const defaultLanguage = await Language.findOne({ where: { default: true } });
    const locale = defaultLanguage?.locale || 'en';

    return Invitation.findByPk(invitationId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname'],
          include: ['roles']
        },
        {
          model: Shop,
          as: 'shop',
          include: [
            {
              model: Translation,
              as: 'translation',
              where: this.language ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale }
                ]
              } : undefined,
              required: false
            }
          ]
        }
      ]
    });
  }

}

module.exports = InviteRepository;
