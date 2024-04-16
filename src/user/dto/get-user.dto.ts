import { IsOptional } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;

  @IsOptional()
  username: string;

  @IsOptional()
  deptId: string;
}
