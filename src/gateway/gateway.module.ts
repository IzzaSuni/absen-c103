import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { record, userSchema } from 'src/absen/absen.model';
import { AlteGateway } from './gateway';

@Module({
  providers: [AlteGateway],
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      { name: 'record', schema: record },
    ]),
    TelegrafModule.forRoot({
      token: '5666463743:AAHOKCSMmsxw2Z1Z0g1ut55W-JSxNjtGSFw',
    }),
  ],
})
export class GatewayModule {}
