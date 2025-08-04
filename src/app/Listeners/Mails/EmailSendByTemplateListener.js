// src/app/Listeners/Mails/EmailSendByTemplateListener.js

const EmailSendService = require('../../../Services/EmailSettingService/EmailSendService');
const { logError } = require('../../../traits/Loggable');
const { EmailSendByTemplate } = require('../../Events/Mails/EmailSendByTemplate');

class EmailSendByTemplateListener {
  constructor() {
    // No constructor logic needed for now
  }

  /**
   * Handle the event
   * @param {EmailSendByTemplate} event
   */
  async handle(event) {
    try {
      if (event.emailTemplate) {
        // Update the email template status to 1
        await event.emailTemplate.update({ status: 1 });

        // Send subscriptions
        const emailService = new EmailSendService();
        await emailService.sendSubscriptions(event.emailTemplate);
      }
    } catch (error) {
      logError(error);
    }
  }
}

module.exports = EmailSendByTemplateListener;
