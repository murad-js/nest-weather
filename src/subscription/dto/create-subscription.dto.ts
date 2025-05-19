import { IsEmail, IsString, IsEnum } from 'class-validator';

const Frequency = {
  HOURLY: 'hourly',
  DAILY: 'daily',
} as const;

type Frequency = (typeof Frequency)[keyof typeof Frequency];

export class CreateSubscriptionDto {
  @IsEmail()
  email: string;

  @IsString()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
