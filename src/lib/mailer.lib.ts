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

  private wrapWithBaseTemplate(content: string): string {
    const appName = "VersenyApp"; // Or use process.env.APP_NAME

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; padding: 2rem;">
        <div style="max-width: 600px; margin: auto; overflow: hidden; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
          
          <div style="background: #000; padding: 1rem; text-align: center;">
            <span style="color: #fff; font-size: 1.25rem; font-weight: 600;">${appName}</span>
          </div>
  
          <div style="background: #fff; padding: 2rem;">
            ${content}
          </div>
  
          <div style="background: #000; padding: 1rem; text-align: center;">
            <span style="color: #9ca3af; font-size: 0.875rem;">Ez egy automatikus üzenet. Kérjük, ne válaszoljon rá.</span>
          </div>
  
        </div>
      </div>
    `;
  }

  async sendEmail(to: string | string[], subject: string, html: string) {
    const recipients = Array.isArray(to) ? to.join(", ") : to;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipients,
      subject,
      html,
    };
    try {
      const wrappedHtml = this.wrapWithBaseTemplate(html);
      mailOptions.html = wrappedHtml;
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      if (error instanceof Error) logger.error("[MAILER] " + error.message);
      return false;
    }
    return true;
  }
}