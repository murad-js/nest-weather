import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';

import { WeatherResponseDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'http://api.weatherapi.com/v1';
  private readonly errorCodes = {
    CITY_NOT_FOUND: 1006,
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHERAPI_API_KEY');
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/current.json`, {
          params: {
            key: this.apiKey,
            q: city,
          },
        }),
      );

      const { current } = data as {
        current: {
          temp_c: number;
          humidity: number;
          condition: { text: string };
        };
      };

      return {
        temperature: current.temp_c,
        humidity: current.humidity,
        description: current.condition.text,
      };
    } catch (error) {
      if (error.response?.data.error.code === this.errorCodes.CITY_NOT_FOUND) {
        throw new NotFoundException('City not found');
      }

      throw error;
    }
  }
}
