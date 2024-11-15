import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587, // Usually 587 for TLS or 465 for SSL
      secure: false,
      auth: {
        user: 'asadtanvir20@gmail.com',
        pass: 'ZGRIB7TKYg083z9h',
      },
    });
  }

  // Function to send email
  async sendEmail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: `"Algorim Team" <algorimsoftware@outlook.com>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new Error('Failed to send email');
    }
  }
}
