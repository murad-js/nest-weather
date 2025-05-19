import { Controller, Post, Get, Body, Param } from '@nestjs/common';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('api')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('/subscribe')
  async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get('/confirm/:token')
  async confirmSubscription(@Param('token') token: string) {
    return this.subscriptionService.confirmSubscription(token);
  }

  @Get('/unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    return this.subscriptionService.unsubscribe(token);
  }
}
