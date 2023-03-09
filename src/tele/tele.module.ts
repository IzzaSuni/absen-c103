import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { record, userSchema } from 'src/absen/absen.model';

import { TeleService } from './tele.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      { name: 'record', schema: record },
    ]),
  ],
  providers: [TeleService],
})
export class TeleModule {}
