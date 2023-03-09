import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { User, Record } from './absen/absen.model';
import ExcelJS from 'exceljs';
import * as moment from 'moment';
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
];

@Update()
@Injectable()
export class AppService {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
  ) {}

  getData(): { message: string } {
    return {
      message: 'Selamat datang di bot Cek absensi C103 ruang pengadaan ITERA',
    };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(
      'Selamat datang di bot Cek absensi C103 ruang pengadaan ITERA',
    );
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply(
      'Butuh bantuan? silahkan kontak developer (tanya pak ali) ',
    );
  }

  @Command(['rekap', ...months])
  async hearsHi(@Ctx() ctx: any) {
    console.log(ctx);
    const messageFromBot = ctx.update?.message?.text.toString().toLowerCase();
    if (messageFromBot === '/rekap') {
      let msg = `Rekap absensi C103 tahun ${moment().format(
        'YYYY',
      )}, mohon untuk pilih bulan\n\n`;
      months.map(async (month) => (msg = msg + `/${month}\n\n`));
      await ctx.reply(msg);
    } else if (
      months.includes(messageFromBot.substring(1, messageFromBot.length))
    ) {
      const selectedMonth = messageFromBot?.substring(1, messageFromBot.length);

      const allRecord = await this.record.find().exec();
      allRecord.filter((record) => {
        return record.record_time
          .toLowerCase()
          .includes(selectedMonth.toLowerCase());
      });
      console.log(allRecord);
      if (allRecord.length > 0) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Absensi');
        const sheet = {};
        months.forEach((month) => {
          const findMonths = allRecord.filter(
            (record, index) =>
              index === new Date(record.record_time).getMonth(),
          );
          if (findMonths.length > 0) sheet[month] = findMonths;
        });
        allRecord.forEach((data) => {
          worksheet.addRow({
            ...data,
          });
        });
        return await workbook.xlsx.writeFile('sales-report.xlsx');
      } else {
        return await ctx.reply('Maaf data kosong');
      }
    }
  }
}
