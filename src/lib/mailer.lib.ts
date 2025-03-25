'use server';
import nodemailer from 'nodemailer';

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

export class AccountMailer extends Mailer {
  constructor() {
    super();
  }
  async sendVerificationEmail(to: string, token: string) {
    const subject = 'Fiók megerősítése';
    const html = `
      <p>A regisztráció folytatásához, kérjük folytassa az alábbi linken:</p>
      <a href="${process.env.NEXTAUTH_URL}/verify/token=${token}">Megerősítés</a>
    `;
    await this.sendEmail(to, subject, html);
  }
}