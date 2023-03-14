import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { User, Record, Secret, Chat } from './absen/absen.model';
import * as moment from 'moment';
import generateSecret from './utils';

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
];

@Update()
@Injectable()
export class AppService {
  constructor(
    @InjectModel('user') private readonly user: Model<User>,
    @InjectModel('record') private readonly record: Model<Record>,
    @InjectModel('secret') private readonly secrets: Model<Secret>,
    @InjectModel('chat') private readonly Chat: Model<Chat>,
  ) {}

  getData(): { message: string } {
    return {
      message: 'Selamat datang di bot Cek absensi C103 ruang pengadaan ITERA',
    };
  }

  @Start()
  async startCommand(ctx: any) {
    const senderInfo = ctx.update.message.chat;
    await ctx.reply(
      `Selamat datang ${senderInfo.first_name}\nAnda telah mensubsribe bot ini dan akan menerima update terkait absensi di ruangan C103 ITERA\n\nUntuk unsubscribe kirim perintah /stop yaa`,
    );
    const findSenderStored = await this.Chat.findOne({ id: senderInfo.id });
    if (findSenderStored) return;
    const newChat = new this.Chat({
      id: senderInfo.id,
      first_name: senderInfo.first_name,
    });
    await newChat.save();
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply(
      'Butuh bantuan atau ada keluhan? silahkan kontak developer @AkbarIzza ',
    );
  }

  @Command(['rekap', ...months, 'stop'])
  async hearsHi(@Ctx() ctx: any) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const messageFromBot = ctx.update?.message?.text.toString().toLowerCase();
    if (messageFromBot === '/stop') {
      const senderInfo = ctx.update.message.chat;
      await this.Chat.findOneAndDelete({ id: senderInfo.id });
      await ctx.reply('Anda telah unsubscribe dan tidak lagi menerima update');
      return;
    } else if (messageFromBot === '/rekap') {
      const msg = `Rekap absensi C103 tahun ${moment().format('YYYY')}`;
      await ctx.reply(msg);
    }
    const selectedMonth = messageFromBot?.substring(1, messageFromBot.length);
    const allRecord = await this.record.find().exec();
    allRecord.filter((record) => {
      return record.record_time
        .toLowerCase()
        .includes(selectedMonth.toLowerCase());
    });
    if (allRecord.length > 0) {
      const secret = generateSecret();
      const findCurrentStoredSecret = await this.secrets.findOne();
      //assign new secret
      findCurrentStoredSecret.secret = secret;
      await findCurrentStoredSecret.save();
      ctx.replyWithHTML(
        'Silahkan download file berikut',
        Markup.inlineKeyboard([
          [
            Markup.button.url(
              'AbsensiC103.xlsx',
              `http://alte-gacor.site/download.xlsx?secret=${secret}`,
            ),
          ],
        ]),
      );
    } else {
      return await ctx.reply('Maaf data kosong');
    }
  }
}
