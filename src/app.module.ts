import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { DiseasesModule } from './modules/diseases/diseases.module';
import { PlantsModule } from './modules/plants/plants.module';
import { FilesModule } from '@modules/files/files.module';
import { Roles } from 'auth/auth.decorator';
import { RolesModule } from '@modules/roles/roles.module';
import { DiagnosisModule } from '@modules/diagnosis/diagnosis.module';
import { PostsModule } from '@modules/posts/posts.module';
import { CommentsModule } from '@modules/comments/comments.module';
import { TicketsModule } from '@modules/tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    DiseasesModule,
    PlantsModule,
    FilesModule,
    RolesModule,
    DiagnosisModule,
    PostsModule,
    CommentsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
