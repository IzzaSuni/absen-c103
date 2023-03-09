import { Body, Controller, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { User, Record } from './absen.model';

@Controller()
export class AbsenController {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
  ) {}
  @Post('record')
  async seedRecord(@Body() body: any) {
    const { code_tag } = body;
    const user = await this.user.findOne({ code_tag: code_tag }).exec();
    if (!user) return;
    const newRecord = new this.record({
      record_time: moment().format('DD MMMM YYYY, hh:mm:ss'),
    });
    user?.record_time.push(newRecord);
    await user.save();
    await newRecord.save();
  }

  @Post('user')
  async seedUser(@Body() body: any) {
    const newUser = new this.user({
      username: body.username,
      code_tag: body.code_tag,
    });
    await newUser.save();
  }
}

const a = [
  { username: 'kawarizmi', record_time: '18 september 2023, 07:01:00' },
  { username: 'rizmi', record_time: '15 Januari 2023, 07:05:00' },
  { username: 'kawa', record_time: '8 november 2023, 07:09:00' },
  { username: 'kami', record_time: '5 oktober 2023, 06:00:00' },
  { username: 'awari', record_time: '20 Juli 2023, 07:11:00' },
  { username: 'wariz', record_time: '29 Mei 2023, 06:25:00' },
  { username: 'aku', record_time: '11 April 2023, 07:19:00' },
  { username: 'kiki', record_time: '18 Februari 2023, 06:40:00' },
];
