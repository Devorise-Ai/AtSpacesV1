import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from '../../application/interfaces/external/email-service.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements IEmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL || 'mostafadamisi@gmail.com',
                pass: process.env.SMTP_APP_PASSWORD || 'qngblzarnyscpadq',
            },
        });
    }

    async send(to: string, subject: string, body: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: '"AtSpaces Agent" <mostafadamisi@gmail.com>',
                to,
                subject,
                text: body,
            });
            this.logger.log(`\u2705 Email successfully sent to ${to}`);
        } catch (error) {
            this.logger.error(`\u274C Error sending email to ${to}:`, error);
        }
    }
}
