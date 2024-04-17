import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './department.entity';
import { User } from '../user/user.entity';
import { Serialize } from '../decorators/serialize.decorators';
import { GetDepartmentPipe } from './pipes/get-department.pipe';
import { pageListDataProps } from '../types/pageListBody.type';
import { ScreenDepartmentDto } from './dto/get-department.dto';
import { ResponsePageProps } from 'src/types/responsePage.type';
import { AuthGuard } from '@nestjs/passport';
import { UserReq } from '../types/userReq.type';

@Controller('system/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Post(':id/addUser')
  addUser(
    @Param('id') id: string,
    @Body() addUser: { userIds: string[] },
  ): Promise<any> {
    const { userIds } = addUser;
    return this.departmentService.addUser(id, userIds);
  }

  @Get('/list')
  findAllList(): Promise<Department[]> {
    return this.departmentService.findAllList();
  }

  @Get()
  findAll(
    @Query(GetDepartmentPipe) query: pageListDataProps<ScreenDepartmentDto>,
  ): Promise<ResponsePageProps<Department>> {
    return this.departmentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @Get(':userId/users')
  @Serialize(User)
  findUsers(@Param('userId') userId: string): Promise<User[]> {
    return this.departmentService.findUsers(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    console.log(updateDepartmentDto);
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.departmentService.remove(id);
  }

  @Delete(':deptId/users/:userId')
  removeUser(
    @Param('deptId') deptId: string,
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.departmentService.removeUser(deptId, userId);
  }
}
