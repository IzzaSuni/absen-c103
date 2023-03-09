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
      record_time: `${moment().format('DD MMMM YYYY, hh:mm:ss')}`,
      username: user.username,
    });
    user?.record_time.push(newRecord);
    await user.save();
    await newRecord.save();

    console.log(moment().format('DD MMMM YYYY, hh:mm:ss'), { user });

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
}
