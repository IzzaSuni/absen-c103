import { Module } from '@nestjs/common';
import { AbsenController } from './absen.controller';

@Module({
  controllers: [AbsenController],
})
export class AbsenModule {}
