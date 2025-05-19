import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { MailerService } from '../mailer/mailer.service';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private mailerService: MailerService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { email: createSubscriptionDto.email },
    });

    if (existingSubscription) {
      throw new ConflictException('Email already subscribed');
    }

    const confirmationToken = randomBytes(32).toString('hex');
    const unsubscribeToken = randomBytes(32).toString('hex');

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      confirmationToken,
      unsubscribeToken,
    });

    await this.subscriptionRepository.save(subscription);

    await this.mailerService.sendConfirmationEmail(
      subscription.email,
      subscription.city,
      confirmationToken,
    );

    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  async confirmSubscription(token: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { confirmationToken: token },
    });

    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    if (subscription.confirmed) {
      throw new BadRequestException('Invalid token');
    }

    subscription.confirmed = true;
    await this.subscriptionRepository.save(subscription);

    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { unsubscribeToken: token },
    });

    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    await this.subscriptionRepository.remove(subscription);

    return { message: 'Unsubscribed successfully' };
  }
}
