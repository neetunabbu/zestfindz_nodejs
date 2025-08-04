// src/app/Listeners/Mails/SendEmailVerificationListener.js

const SendEmailVerification = require('../../Events/Mails/SendEmailVerification');
const User = require('../../../models/User');
const EmailSendService = require('../../../Services/EmailSettingService/EmailSendService');
const { logError } = require('../../../traits/Loggable');

class SendEmailVerificationListener {
  constructor() {
    // constructor logic if needed
  }

  /**
   * Handle the event
   * @param {SendEmailVerification} event
   */
  async handle(event) {
    try {
      if (event.user) {
        const token = String(Date.now()).slice(-6); // same as mb_substr((string)time(), -6, 6)

        // Update user with token
        await User.updateOne({ _id: event.user._id }, { verify_token: token });

        // Fetch updated user
        const updatedUser = await User.findById(event.user._id);

        // Send verification email
        await new EmailSendService().sendVerify(updatedUser);
      }
    } catch (e) {
      logError(e);
    }
  }
}

module.exports = SendEmailVerificationListener;
