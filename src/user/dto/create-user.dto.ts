import { IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 20)
  username: string;

  @IsString()
  @Length(1, 100)
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsOptional()
  realName: string;

  @IsOptional()
  phone: string;

  @IsString()
  deptId: string;
}
