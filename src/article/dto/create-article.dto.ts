import { IsArray, IsEnum, IsString } from 'class-validator';

type ACCESS_TYPE = 'all' | 'can' | 'cant';

const WhoTypeEnum: ACCESS_TYPE[] = ['all', 'can', 'cant'];

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(WhoTypeEnum)
  whoType: ACCESS_TYPE;

  @IsArray()
  deptList: string[];

  @IsArray()
  userList: string[];
}
