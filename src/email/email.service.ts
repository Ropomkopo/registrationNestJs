import { Injectable, Logger } from '@nestjs/common';
import sgMail = require('@sendgrid/mail');
import { ConfigService } from '../config/config.service';

@Injectable()
export class EmailService {

  constructor(
    private readonly configService: ConfigService
  ) { }
  public async sendEmail(to: string, from: string = this.configService.get('sender_email'), subject: string, html: string): Promise<any> {
    try {
      sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
      // tslint:disable-next-line: typedef
      const data = await sgMail.send([{
        to,
        from,
        subject,
        html,
      }]);
      Logger.log(`Function:sendEmail, email:${to}, Code is send`);
    } catch (error) {
      Logger.error(`Function:sendEmail, ${error}sendEmail, Error sending sms for email`);
    }
  }
}
