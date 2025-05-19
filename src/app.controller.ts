import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  serveStaticPage(@Res() res: Response) {
    console.log('serveStaticPage');
    console.log(join(__dirname, '..', 'public', 'index.html'));

    return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
