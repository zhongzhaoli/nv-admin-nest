import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @IsOptional()
  description: string;
}

export class EditDepartmentUserDto {
  @IsNotEmpty()
  @IsArray()
  userIds: string[];
}
