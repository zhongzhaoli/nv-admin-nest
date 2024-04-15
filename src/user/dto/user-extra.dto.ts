import { IsNotEmpty, IsString } from 'class-validator';

export class UserSetRoleDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;
}
