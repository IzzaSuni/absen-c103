import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { User, Record } from './absen/absen.model';
import * as ExcelJS from 'exceljs';
import * as moment from 'moment';
import * as tmp from 'tmp';

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
      if (allRecord.length > 0) {
        const workbook = new ExcelJS.Workbook();
        const sheet: any = {};
        months.forEach((month, monthIndex) => {
          const findMonths = allRecord.filter(
            (record) => monthIndex === new Date(record.record_time).getMonth(),
          );
          if (findMonths.length > 0) sheet[month] = findMonths;
        });

        Object.keys(sheet).forEach((month) => {
          const worksheet = workbook.addWorksheet(month);
          const data = sheet[month];
          const rows = [];

          data.forEach((row) => {
            console.log(row);
            delete row.__v;
            rows.push([row.username, row.record_time]);
          });
          rows.unshift(['Username', 'Timestamp']);
          worksheet.addRow({
            ...rows,
          });
        });
        ctx.reply('File sedang dibuat harap tunggu...');
        let File = await new Promise((resolve, reject) => {
          tmp.file(
            {
              discarDescriptor: true,
              prefix: 'Absensi C103',
              postfix: '.xlsx',
              mode: parseInt('0600', 8),
            },
            async (err, file) => {
              if (err) throw new BadRequestException(err);

              workbook.xlsx
                .writeFile(file)
                .then(() => resolve(file))
                .catch((err) => {
                  throw new BadRequestException(err);
                });
            },
          );
        });
        ctx.reply('File sudah dibuat');

        console.log(File);
      } else {
        return await ctx.reply('Maaf data kosong');
      }
    }
  }
}
