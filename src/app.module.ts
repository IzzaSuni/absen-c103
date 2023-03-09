import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from './gateway/gateway.module';
import { TeleModule } from './tele/tele.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://absen-masuk:absen-masuk@cluster0.klx1tw2.mongodb.net/Cluster0?retryWrites=true&w=majority',
    ),
    GatewayModule,
    TeleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModuleAli {}
