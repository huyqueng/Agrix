import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
