// src/services/EmailSettingService/EmailSendService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const nodemailer = require('nodemailer');
const { EmailSetting } = require('../../models/EmailSetting');
const { EmailTemplate } = require('../../models/EmailTemplate');
const { EmailSubscription } = require('../../models/EmailSubscription');
const { Gallery } = require('../../models/Gallery');
const { Order } = require('../../models/Order');
const { Settings } = require('../../models/Settings');
const { Translation } = require('../../models/Translation');
const { User } = require('../../models/User');
const { renderTemplateToHtml } = require('../../utils/templateRenderer');
const { getHostUrl } = require('../../utils/url');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

class EmailSendService extends CoreService {
  getModelClass() {
    return EmailSetting;
  }

  async sendSubscriptions(emailTemplate) {
    const emailSetting = await emailTemplate.getEmailSetting();

    const transporter = this.createTransport(emailSetting);

    const subscribers = await EmailSubscription.findAll({
      where: { active: true },
      include: [{ model: User }],
    });

    const attachments = await Promise.all(
      emailTemplate.galleries.map(async (gallery) => ({
        filename: path.basename(gallery.path),
        path: `${getHostUrl()}/storage/${gallery.path}`,
      }))
    );

    for (const sub of subscribers) {
      const email = sub.user?.email;
      if (!email) continue;

      await transporter.sendMail({
        from: `${emailSetting.from_site} <${emailSetting.from_to}>`,
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.body,
        text: emailTemplate.alt_body,
        attachments,
      });
    }

    return { status: true, code: ResponseError.NO_ERROR };
  }

  async sendVerify(user) {
    const emailTemplate = await EmailTemplate.findOne({ where: { type: EmailTemplate.TYPE_VERIFY }, include: [Gallery, EmailSetting] });
    const transporter = this.createTransport(emailTemplate?.emailSetting);

    const token = user.verify_token;
    const body = (emailTemplate?.body || 'Please enter code for verify your email: $verify_code').replace('$verify_code', token);
    const altBody = (emailTemplate?.alt_body || body).replace('$verify_code', token);

    const attachments = (emailTemplate?.galleries || []).map(gallery => ({
      filename: path.basename(gallery.path),
      path: `${getHostUrl()}/storage/${gallery.path}`,
    }));

    await transporter.sendMail({
      from: `${emailTemplate?.emailSetting?.from_site} <${emailTemplate?.emailSetting?.from_to}>`,
      to: user.email,
      subject: emailTemplate?.subject || 'Verify your email address',
      html: body,
      text: altBody,
      attachments,
    });

    return { status: true, code: ResponseError.NO_ERROR };
  }

  async sendEmailPasswordReset(user, str) {
    const emailTemplate = await EmailTemplate.findOne({ where: { type: EmailTemplate.TYPE_VERIFY }, include: [Gallery, EmailSetting] });
    const transporter = this.createTransport(emailTemplate?.emailSetting);

    const body = (emailTemplate?.body || 'Please enter code for reset your password: $verify_code').replace('$verify_code', str);
    const altBody = (emailTemplate?.alt_body || body).replace('$verify_code', str);

    const attachments = (emailTemplate?.galleries || []).map(gallery => ({
      filename: path.basename(gallery.path),
      path: `${getHostUrl()}/storage/${gallery.path}`,
    }));

    await transporter.sendMail({
      from: `${emailTemplate?.emailSetting?.from_site} <${emailTemplate?.emailSetting?.from_to}>`,
      to: user.email,
      subject: emailTemplate?.subject || 'Reset password',
      html: body,
      text: altBody,
      attachments,
    });

    return { status: true, code: ResponseError.NO_ERROR };
  }

  async sendOrder(order) {
    const emailSetting = await EmailSetting.findOne();
    const transporter = this.createTransport(emailSetting);
    const titleKey = `order.email.invoice.${order.status}.title`;

    const title = (await Translation.findOne({ where: { locale: this.language, key: titleKey } }))?.value || titleKey;
    const logo = (await Settings.findOne({ where: { key: 'logo' } }))?.value;

    let logoFilePath = '';
    if (logo) {
      const ext = path.extname(logo);
      const filename = `${Date.now()}${ext}`;
      logoFilePath = path.join(__dirname, '../../storage/images/', filename);
      fs.writeFileSync(logoFilePath, fs.readFileSync(logo));
    }

    const html = renderTemplateToHtml('order-email-invoice', {
      order,
      lang: this.language,
      title,
      logo: logoFilePath ? `${getHostUrl()}/storage/images/${path.basename(logoFilePath)}` : '',
    });

    await transporter.sendMail({
      from: `${emailSetting.from_site} <${emailSetting.from_to}>`,
      to: order.user.email,
      subject: title,
      html,
    });

    if (logoFilePath && fs.existsSync(logoFilePath)) fs.unlinkSync(logoFilePath);

    return { status: true, code: ResponseError.NO_ERROR };
  }

  createTransport(emailSetting) {
    return nodemailer.createTransport({
      host: emailSetting.host,
      port: emailSetting.port,
      secure: false,
      auth: {
        user: emailSetting.from_to,
        pass: emailSetting.password,
      },
      tls: emailSetting.ssl || {
        rejectUnauthorized: false,
      },
    });
  }
}

module.exports = EmailSendService;
