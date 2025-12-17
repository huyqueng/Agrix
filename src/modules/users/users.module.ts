import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from 'auth/auth.module';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: User.name,
    //     useFactory: (connection: Connection) => {
    //       const schema = UserSchema;
    //       const AutoIncrement = AutoIncrementFactory(connection);
    //       schema.plugin(AutoIncrement, {
    //         inc_field: 'id',
    //         start_seq: 1,
    //         increment_by: 1,
    //       });
    //       return schema;
    //     },
    //     inject: [getConnectionToken()],
    //   },
    // ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
