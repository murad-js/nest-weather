import { IsEmail, IsString, IsEnum } from 'class-validator';

import { Frequency } from '../../common/constants/frequency';

export class CreateSubscriptionDto {
  @IsEmail()
  email: string;

  @IsString()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
