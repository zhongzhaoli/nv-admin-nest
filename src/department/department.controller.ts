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
  Req,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  EditDepartmentUserDto,
  UpdateDepartmentDto,
} from './dto/update-department.dto';
import { Department } from './department.entity';
import { User } from '../user/user.entity';
import { Serialize } from '../decorators/serialize.decorators';
import { GetDepartmentPipe } from './pipes/get-department.pipe';
import { pageListDataProps } from '../types/pageListBody.type';
import { ScreenDepartmentDto } from './dto/get-department.dto';
import { ResponsePageProps } from 'src/types/responsePage.type';
import { AuthGuard } from '@nestjs/passport';
import { UserReq } from 'src/types/userReq.type';

@Controller('system/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Req() req: UserReq,
  ): Promise<Department> {
    return this.departmentService.create(createDepartmentDto, req.user);
  }

  @Post(':id/addUser')
  addUser(
    @Param('id') id: string,
    @Body() addUser: EditDepartmentUserDto,
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

  @Get(':id/users')
  @Serialize(User)
  findUsers(@Param('id') id: string): Promise<User[]> {
    return this.departmentService.findUsers(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
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
