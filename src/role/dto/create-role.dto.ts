import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Length(1, 15)
  name: string;
}
