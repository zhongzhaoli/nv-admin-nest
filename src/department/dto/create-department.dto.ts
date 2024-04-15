import { IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @Length(1, 15)
  name: string;

  @IsString()
  avatar: string;
}
