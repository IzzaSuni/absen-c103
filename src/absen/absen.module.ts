import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbsenController } from './absen.controller';
import { record, userSchema } from './absen.model';

@Module({
  controllers: [AbsenController],
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      { name: 'record', schema: record },
    ]),
  ],
})
export class AbsenModule {}
