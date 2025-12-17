import { Controller, Get, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ResponseMessage } from 'common/decorators/response-message.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ResponseMessage('Lấy danh sách vai trò người dùng thành công')
  getRoles(): { key: string; name: string }[] {
    return this.rolesService.getAllRoles();
  }
}
