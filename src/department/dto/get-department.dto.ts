import { Department } from '../department.entity';

export interface GetDepartmentDto {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface ScreenDepartmentDto {
  name?: string;
}

export interface ResponseDepartmentProps extends Department {
  memberCount: number;
}
