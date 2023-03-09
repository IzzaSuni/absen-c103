import { Get, Controller, Res, HttpStatus } from '@nestjs/common';
import { TeleService } from './tele.service';

@Controller()
export class TeleController {
  constructor(private botService: TeleService) {}
  @Get()
  getBotDialog(@Res() res) {
    this.botService.botService();
    res.status(HttpStatus.OK).send('Bot service started');
  }
}
