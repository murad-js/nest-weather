import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '../mailer/mailer.module';
import { Subscription } from '../subscription/entities/subscription.entity';
import { WeatherModule } from '../weather/weather.module';
import { WeatherSchedulerService } from './weather-scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Subscription]),
    WeatherModule,
    MailerModule,
  ],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
