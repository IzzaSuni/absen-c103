import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, User } from 'src/absen/absen.model';
import ExcelJS from 'exceljs';

@Injectable()
export class TeleService {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
  ) {}
  private logger = new Logger(TeleService.name);

  botService() {
    process.env.NTBA_FIX_319 = '1';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TelegramBot = require('node-telegram-bot-api');
    const token = '5666463743:AAHOKCSMmsxw2Z1Z0g1ut55W-JSxNjtGSFw';

    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', async (msg) => {
      const messageFromBot = msg.text.toString().toLowerCase();
      console.log({ messageFromBot }, messageFromBot === '/rekap');

      if (messageFromBot === '/rekap') {
        bot.sendMessage(msg.from.id, 'Silahkan pilih bulan');
        bot.sendMessage(
          msg.from.id,
          '/January\n/February\n/March\n/April\n/May\n/June\n/July\n/August\n/September\n/Oktober\n/November\n/Desember\n',
        );
      } else if (messageFromBot.includes(months)) {
        const selectedMonth = messageFromBot?.substring(
          1,
          messageFromBot.length,
        );
        const allRecord = await this.record.find().exec();
        allRecord.filter((record) => {
          return record.record_time
            .toLowerCase()
            .includes(selectedMonth.toLowerCase());
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Data');

        allRecord.forEach((data) => {
          worksheet.addRow({
            ...data,
          });
        });

        return await workbook.xlsx.writeFile('sales-report.xlsx');
      }
    });
  }
}

const months = [
  '/january',
  '/february',
  '/march',
  '/april',
  '/may',
  '/june',
  '/july',
  '/august',
  '/september',
  '/oktober',
  '/november',
  '/desember',
];

// const commandList = {
//   '','rekap': '',
// };
