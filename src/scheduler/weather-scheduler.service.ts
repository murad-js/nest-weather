import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Frequency } from '../common/constants/frequency';
import { MailerService } from '../mailer/mailer.service';
import { Subscription } from '../subscription/entities/subscription.entity';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class WeatherSchedulerService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private weatherService: WeatherService,
    private mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyWeatherUpdates() {
    const hourlySubscribers = await this.subscriptionRepository.find({
      where: {
        frequency: Frequency.HOURLY,
        confirmed: true,
      },
    });

    // Note: Current implementation queries weather individually for each subscriber for simplicity.
    // TODO: Optimize by grouping subscribers by city to avoid redundant weather API calls
    // for the same city. This would reduce API usage and improve performance.
    for (const subscriber of hourlySubscribers) {
      try {
        const weather = await this.weatherService.getWeather(subscriber.city);
        await this.mailerService.sendWeatherUpdate(
          subscriber.email,
          subscriber.city,
          Frequency.HOURLY,
          weather,
          subscriber.unsubscribeToken,
        );
      } catch (error) {
        console.error(
          `Failed to send hourly weather update to ${subscriber.email}:`,
          error,
        );
      }
    }
  }

  // Note: For better user experience, we should respect the timezone of each city/user
  // and send daily updates at 9 AM in their local time. Current implementation
  // uses server timezone for simplicity.
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyWeatherUpdates() {
    const dailySubscribers = await this.subscriptionRepository.find({
      where: {
        frequency: Frequency.DAILY,
        confirmed: true,
      },
    });

    for (const subscriber of dailySubscribers) {
      try {
        const weather = await this.weatherService.getWeather(subscriber.city);
        await this.mailerService.sendWeatherUpdate(
          subscriber.email,
          subscriber.city,
          Frequency.DAILY,
          weather,
          subscriber.unsubscribeToken,
        );
      } catch (error) {
        console.error(
          `Failed to send daily weather update to ${subscriber.email}:`,
          error,
        );
      }
    }
  }
}
