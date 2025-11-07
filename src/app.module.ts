import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://huyqueng_db_user:Vs8eYYwCrgG3nnDw@cluster1.mob2bsp.mongodb.net'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
  
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
