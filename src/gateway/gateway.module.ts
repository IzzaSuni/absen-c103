import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { record, userSchema } from 'src/absen/absen.model';
import { AlteGateway } from './gateway';

@Module({
  providers: [AlteGateway],
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      { name: 'record', schema: record },
    ]),
  ],
})
export class GatewayModule {}
