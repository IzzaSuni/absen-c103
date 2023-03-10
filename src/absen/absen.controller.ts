import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { User, Record, Secret } from './absen.model';
import * as ExcelJS from 'exceljs';
import * as tmp from 'tmp';
import generateSecret from 'src/utils';

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

@Controller()
export class AbsenController {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
    @InjectModel('secret') private readonly secret: Model<Secret>,
  ) {}

  @Post('record')
  async seedRecord(@Body() body: any) {
    const { code_tag } = body;
    moment.locale('id');
    const user = await this.user.findOne({ code_tag: code_tag }).exec();
    if (!user) return;
    const newRecord = new this.record({
      record_time: `${moment().format('DD MMMM YYYY, hh:mm:ss')}`,
      username: user.username,
    });
    user?.record_time.push(newRecord);
    await user.save();
    await newRecord.save();
    return newRecord;
  }

  @Post('user')
  async seedUser(@Body() body: any) {
    const newUser = new this.user({
      username: body.username,
      code_tag: body.code_tag,
    });
    await newUser.save();

    return newUser;
  }

  @Get('download.xlsx')
  @Header('Content-Type', 'text/xlsx')
  async getUser(@Res() res: any, @Query('secret') secretFromQuery: string) {
    moment.locale('id');
    const currentStoredSecret = await this.secret.findOne();
    // if (currentStoredSecret.secret !== secretFromQuery)
    //   return 'Hadeh cuy gabole';
    currentStoredSecret.secret = generateSecret();
    await currentStoredSecret.save();
    const allRecord = await this.record.find().exec();
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
        worksheet.addRow(['Username', 'Timestamp']);
        data.forEach((row) => {
          delete row.__v;
          delete row._id;
          worksheet.addRow([row.username, `${row.record_time} WIB`]);
        });

        worksheet.getColumn(1).width = 20;
        worksheet.getColumn(2).width = 30;
        worksheet.getCell('A1').fill = {
          type: 'pattern',
          pattern: 'solid',
          bgColor: { argb: '000000' },
        };
        worksheet.getCell('B1').fill = {
          type: 'pattern',
          pattern: 'solid',
          bgColor: { argb: '000000' },
        };
        worksheet.getCell('A1').font = {
          size: 14,
          color: { argb: 'FFFFFF' },
        };
        worksheet.getCell('A1').font = {
          size: 14,
          color: { argb: 'FFFFFF' },
        };
        worksheet.getCell('B1').font = {
          size: 14,
          color: { argb: 'FFFFFF' },
        };
        worksheet.getColumn(1).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
        worksheet.getColumn(2).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
        Array(data.length + 1)
          .fill('')
          .map(
            (e, i) =>
              (worksheet.getCell(`A${i + 1}`).border = {
                top: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
              }),
          );
        Array(data.length + 1)
          .fill('')
          .map(
            (e, i) =>
              (worksheet.getCell(`B${i + 1}`).border = {
                top: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
              }),
          );
      });

      const File = await new Promise((resolve, reject) => {
        tmp.file(
          {
            prefix: 'Absensi C103',
            postfix: '.xlsx',
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

      return res.download(`${File}`);
    }
  }
}
