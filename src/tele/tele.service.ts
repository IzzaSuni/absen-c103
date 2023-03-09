import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TeleService {
  private logger = new Logger(TeleService.name);

  botService() {
    process.env.NTBA_FIX_319 = '1';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TelegramBot = require('node-telegram-bot-api');
    const token = '5666463743:AAHOKCSMmsxw2Z1Z0g1ut55W-JSxNjtGSFw';

    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', (msg) => {
      console.log({ msg }, "halo");
      const Hi = 'hi';
      if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(
          msg.from.id,
          'Hello ' +
            msg.from.first_name +
            ' what would you like to know about me ?',
        );
      }
      console.log(this.logger);
    });
  }
}
