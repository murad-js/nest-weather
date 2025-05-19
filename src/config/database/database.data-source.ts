import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../../app.module';

export const dataSource = NestFactory.create(AppModule)
  .then((app) => app.get(DataSource))
  .then((dataSource) => Promise.all([dataSource, dataSource.destroy()]))
  .then(([dataSource]) => dataSource);
