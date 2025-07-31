// src/app/Events/Mails/SendEmailVerification.js

// Importing the User model
const User = require('../../../models/User');

class SendEmailVerification {
  /**
   * Constructor to create a new event instance
   * @param {User|null} user 
   */
  constructor(user = null) {
    /**
     * @type {User|null}
     */
    this.user = user;
  }

  /**
   * Get the channels the event should broadcast on
   * @returns {string} 
   */
  broadcastOn() {
    // This simulates Laravel's PrivateChannel
    return 'channel-name';
  }
}

module.exports = SendEmailVerification;
