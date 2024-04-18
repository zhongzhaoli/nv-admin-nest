import { IsOptional } from 'class-validator';
import { User } from '../user.entity';

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

export interface ResponseUserInfoProps extends User {
  memberCount: number;
  memberAvatarList: string[];
}
