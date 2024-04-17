import { IsString } from 'class-validator';

export class UserSetRoleDto {
  @IsString()
  roleId: string;
}

export class UserSetDeptDto {
  @IsString()
  userId: string;

  @IsString()
  deptId: string;
}
