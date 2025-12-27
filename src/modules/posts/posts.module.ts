import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { Module } from '@nestjs/common';
import { Counter, CounterSchema } from 'shared/counter.entity';
import { UsersModule } from '@modules/users/users.module';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { PostLike, PostLikeSchema } from './entities/like.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: User.name, schema: UserSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
