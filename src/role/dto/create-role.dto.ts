import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  name: string;

  @IsString()
  description: string;
}
