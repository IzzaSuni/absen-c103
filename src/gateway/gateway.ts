import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Ctx } from 'nestjs-telegraf';
import { Server } from 'socket.io';
import { UserParam, Record, User } from 'src/absen/absen.model';
import { Context } from 'telegraf';
moment.locale('id');
@WebSocketGateway({ cors: true })
export class AlteGateway implements OnModuleInit {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
  ) {}

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket) => {
      const query = String(socket.handshake.query.secret);
      if (query !== 'secret-asjkndaksdkas ckwndi232i3ubKNIASNAKSDoia') {
        return socket.disconnect(true);
      }
    });
  }

  // absen
  @SubscribeMessage('absen')
  async onControlRelay(
    @MessageBody()
    body: any,
    @Ctx() ctx: Context,
  ) {
    if (body.code_tag) {
      const user = await this.user.findOne({ code_tag: body.code_tag });
      const record = new this.record({
        record_time: `${moment().format('DD MMMM YYYY, hh:mm:ss')}`,
        username: user.username,
      });
      user.record_time?.push(record);
      await record.save();
      await user.save();

      const message = `Absen LOG\nNama: ${user.username}\nCode: ${
        body.code_tag
      }\nTanggal: ${moment().format(
        'DDDD MMMM YYYY',
      )}\nPukul: ${moment().format('hh:mm:ss')}`;

      ctx.reply(message);
      return this.server.emit(message);
    }
    const message = `Intruder LOG\nCode: ${
      body.code_tag
    }\nTanggal: ${moment().format('DDDD MMMM YYYY')}\nPukul: ${moment().format(
      'hh:mm:ss',
    )}`;
    ctx.reply(message);
    return this.server.emit(message);
  }
}
