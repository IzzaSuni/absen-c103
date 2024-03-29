import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from './gateway/gateway.module';
import { TeleModule } from './tele/tele.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { chatId, record, secret, userSchema } from './absen/absen.model';
import { AbsenModule } from './absen/absen.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://absen-masuk:absen-masuk@cluster0.klx1tw2.mongodb.net/Cluster0?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      { name: 'record', schema: record },
      { name: 'secret', schema: secret },
      { name: 'chat', schema: chatId },
    ]),
    GatewayModule,
    TeleModule,
    TelegrafModule.forRoot({
      token: '5666463743:AAHOKCSMmsxw2Z1Z0g1ut55W-JSxNjtGSFw',
    }),
    AbsenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModuleAli {}
