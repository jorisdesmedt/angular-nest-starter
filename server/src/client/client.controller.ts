import { Get, Controller, Request, Response } from '@nestjs/common';

@Controller()
export class ClientController {
  constructor() {}

  @Get()
  root(@Request() req, @Response() res) {
    res.render('index', {
      req,
      res,
    });
  }
}
