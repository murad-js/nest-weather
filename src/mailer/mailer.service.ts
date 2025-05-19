import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';

import { Frequency } from '../common/constants/frequency';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: handlebars.TemplateDelegate;
  private weatherUpdateTemplate: handlebars.TemplateDelegate;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('GOOGLE_APP_USER'),
          pass: this.configService.get<string>('GOOGLE_APP_PASSWORD'),
        },
      },
      {
        from: {
          name: 'Test Weather App',
          address: this.configService.get<string>('GOOGLE_APP_USER'),
        },
      },
    );

    this.confirmationTemplate = this.loadTemplate('confirmation.hbs');
    this.weatherUpdateTemplate = this.loadTemplate('weather-update.hbs');
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = join(__dirname, './templates');
    const templatePath = join(templatesFolderPath, templateName);

    const templateSource = readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
  }

  async sendConfirmationEmail(
    email: string,
    city: string,
    confirmationToken: string,
  ) {
    const confirmationUrl = `${this.configService.get<string>('API_URL')}/api/confirm/${confirmationToken}`;
    const html = this.confirmationTemplate({
      city,
      confirmationUrl,
    });

    await this.transporter.sendMail({
      to: email,
      subject: 'Confirm Your Weather Subscription',
      html,
    });
  }

  async sendWeatherUpdate(
    email: string,
    city: string,
    frequency: Frequency,
    weather: { temperature: number; humidity: number; description: string },
    unsubscribeToken: string,
  ) {
    const unsubscribeUrl = `${this.configService.get<string>('API_URL')}/api/unsubscribe/${unsubscribeToken}`;
    const html = this.weatherUpdateTemplate({
      city,
      frequency,
      temperature: weather.temperature,
      humidity: weather.humidity,
      description: weather.description,
      unsubscribeUrl,
    });

    await this.transporter.sendMail({
      to: email,
      subject: `Weather Update for ${city}`,
      html,
    });
  }
}
