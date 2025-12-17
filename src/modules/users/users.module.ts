import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from 'auth/auth.module';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { Connection } from 'mongoose';
@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: (connection: Connection) => {
          const schema = UserSchema;
          schema.plugin(AutoIncrementID, {
            field: 'userId', // Tên field cần auto-increment
            startAt: 1, // Bắt đầu từ 1
            incrementBy: 1, // Tăng 1 mỗi lần
          });
          return schema;
        },
        inject: [getConnectionToken()], // Inject connection mặc định
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
