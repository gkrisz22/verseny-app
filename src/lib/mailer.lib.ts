import nodemailer from 'nodemailer';
import { logger } from './logger';

export class Mailer {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string | string[], subject: string, html: string) {
    const recipients = Array.isArray(to) ? to.join(', ') : to;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipients,
      subject,
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    }
    catch (error) {
      if (error instanceof Error)
        logger.error("[MAILER] " + error.message);
      return false;
    }
    return true;
  }
}