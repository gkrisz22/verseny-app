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

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}

class AccountMailer extends Mailer {
  constructor() {
    super();
  }
  async sendVerificationEmail(to: string, token: string) {
    const subject = 'Fiók megerősítése';
    const html = `
      <p>A regisztráció folytatásához, kérjük folytassa az alábbi linken:</p>
      <a href="${process.env.URL}/sign-up/verify/${token}">Megerősítés</a>
    `;
    try {
      await this.sendEmail(to, subject, html);
      logger.info(`Verification email sent to ${to}`);
      return true;
    }
    catch (error) {
      console.error(error);
      logger.error(`Error sending verification email to ${to}`);
      return false;
    }
  }
}

export const accountMailer = new AccountMailer();