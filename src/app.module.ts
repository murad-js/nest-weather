import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { DatabaseModule } from './config/database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { validate } from './config/env.validation';
import { WeatherModule } from './weather/weather.module';
import { WeatherSchedulerModule } from './scheduler/weather-scheduler.module';

@Module({
  imports: [
    DatabaseModule,
    SubscriptionModule,
    WeatherModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MailerModule,
    WeatherSchedulerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
