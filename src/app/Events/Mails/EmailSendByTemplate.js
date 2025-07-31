// src/app/Events/Mails/EmailSendByTemplate.js

// Import the EmailTemplate model
const EmailTemplate = require('../../../Models/EmailTemplate');

class EmailSendByTemplate {
  /**
   * Constructor to initialize EmailTemplate
   * @param {EmailTemplate|null} emailTemplate
   */
  constructor(emailTemplate = null) {
    this.emailTemplate = emailTemplate;
  }

  /**
   * Optionally return the broadcast channel (Not used in Node by default)
   * This is similar to Laravel's broadcastOn
   */
  broadcastOn() {
    return 'channel-name'; // You can handle this with socket.io or event emitters if needed
  }
}

module.exports = EmailSendByTemplate;
