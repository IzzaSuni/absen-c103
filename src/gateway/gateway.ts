import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import axios from 'axios';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { Chat, Record, User } from 'src/absen/absen.model';
moment.locale('id');

@WebSocketGateway({ cors: true })
@Injectable()
export class AlteGateway implements OnModuleInit {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
    @InjectModel('chat') private readonly Chat: Model<Chat>,

    private readonly httpService: HttpService,
  ) {}

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connecteds');
    });
  }

  // absen
  @SubscribeMessage('absen')
  async onControlRelay(
    @MessageBody()
    body: any,
  ) {
    let message = '';
    if (body?.code_tag) {
      const user = await this.user.findOne({ code_tag: body?.code_tag });
      if (!user) {
        message = `Intruder LOG - Tanggal: ${moment().format(
          'DD MMMM YYYY',
        )} - Pukul: ${moment().format('hh:mm:ss')} WIB`;
      } else {
        const record = new this.record({
          record_time: `${moment().format('DD MMMM YYYY, hh:mm:ss')}`,
          username: user?.username,
        });
        user?.record_time?.push(record);
        await record.save();
        await user.save();

        message = `Absen LOG - Nama: ${
          user.username
        } - Tanggal: ${moment().format(
          'DD MMMM YYYY',
        )} - Pukul: ${moment().format('hh:mm:ss')} WIB`;
      }
    } else {
      message = `Intruder LOG - Tanggal: ${moment().format(
        'DD MMMM YYYY',
      )} - Pukul: ${moment().format('hh:mm:ss')} WIB`;
    }

    const users = await this.Chat.find().exec();
    users.map(async ({ id }) => {
      await axios.get(
        `https://api.telegram.org/bot5666463743:AAHOKCSMmsxw2Z1Z0g1ut55W-JSxNjtGSFw/sendMessage?text=${message}&chat_id=${id}`,
      );
    });

    return this.server.emit(message);
  }
}
