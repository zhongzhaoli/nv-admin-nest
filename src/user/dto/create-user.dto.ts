import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  avatar: string;
}
