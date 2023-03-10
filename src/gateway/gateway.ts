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
import { Server } from 'socket.io';
import { UserParam, Record, User } from 'src/absen/absen.model';

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
      console.log(socket.id);
      console.log('connected');
      const query = String(socket.handshake.query.secret);
      // if (query !== 'secret-asjkndaksdkas ckwndi232i3ubKNIASNAKSDoia') {
      //   return socket.disconnect(true);
      // }
    });
  }

  // absen
  @SubscribeMessage('absen')
  async onControlRelay(
    @MessageBody()
    body: any,
  ) {
    if (body.code_tag) {
      const user = this.user.findOne({ code_tag: body.code_tag });
      const record = new this.record({
        record_time: `${moment().format('DD MMMM YYYY, hh:mm:ss')}`,
      });
      (await user).record_time?.push(record);
      (await record).save();
      (await user).save();
      return this.server.emit('berhasil absen');
    }
    return this.server.emit('user tidak ditemukan');
  }
}
