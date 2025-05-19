import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather.dto';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string): Promise<WeatherResponseDto> {
    if (!city) {
      throw new BadRequestException('City parameter is required');
    }

    return this.weatherService.getWeather(city);
  }
}
