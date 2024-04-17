import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  description: string;
}

export class EditRoleRoutesDto {
  @IsNotEmpty()
  @IsArray()
  routeIds: string[];
}
