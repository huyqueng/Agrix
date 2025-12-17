import { Injectable } from '@nestjs/common';

export enum UserRole {
  USER = 'Người dùng',
  ADMIN = 'Quản trị viên',
}

@Injectable()
export class RolesService {
  getAllRoles(): { key: string; name: string }[] {
    return Object.entries(UserRole).map(([key, value]) => ({
      key,
      name: value as string,
    }));
  }
}
