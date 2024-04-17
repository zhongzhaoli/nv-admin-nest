import { IsOptional } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;

  @IsOptional()
  username: string;

  @IsOptional()
  deptId: string;
}

export interface ScreenUserDto {
  username?: string;
  status?: boolean;
  deptId: string;
}
