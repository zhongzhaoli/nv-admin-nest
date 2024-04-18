import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @IsOptional()
  realName: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  email: string;

  @IsOptional()
  deptId: string;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  status: boolean;
}
