import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbsenController } from './absen.controller';
import { record, secret, userSchema } from './absen.model';

@Module({
  controllers: [AbsenController],
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      { name: 'record', schema: record },
      { name: 'secret', schema: secret },
    ]),
  ],
})
export class AbsenModule {}
