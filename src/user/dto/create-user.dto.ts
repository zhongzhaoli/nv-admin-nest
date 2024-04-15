import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 20)
  username: string;

  @IsString()
  @Length(1, 100)
  password: string;

  @IsString()
  avatar: string;
}
