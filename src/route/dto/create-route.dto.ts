import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { RouteType } from '../route.entity';

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  pid: string;

  @IsNotEmpty()
  @IsString()
  type: RouteType;

  @IsOptional()
  sort: number;

  @IsOptional()
  breadcrumbHidden: boolean;

  @IsOptional()
  affix: boolean;

  @IsOptional()
  hidden: boolean;

  @IsOptional()
  keepAlive: boolean;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  @Length(1, 15)
  title: string;

  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @Length(1, 100)
  path: string;

  @IsString()
  @Length(1, 150)
  component: string;
}
