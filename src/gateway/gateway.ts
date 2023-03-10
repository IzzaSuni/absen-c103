import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
      console.log(socket);
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
  ) {
    console.log(body);
    return;
  }
}
