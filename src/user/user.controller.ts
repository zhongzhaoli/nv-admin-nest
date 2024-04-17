import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { TimestampInterceptor } from '../interceptor/timestamp.interceptor';
import { Serialize } from '../decorators/serialize.decorators';
import { GetUserPipe } from './pipes/get-user.pipe';
import { UserSetDeptDto, UserSetRoleDto } from './dto/user-extra.dto';
import { pageListDataProps } from 'src/types/pageListBody.type';
import { ScreenUserDto } from './dto/get-user.dto';

@Controller('system/users')
@UseInterceptors(TimestampInterceptor)
@Serialize(User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query(GetUserPipe)
    query: pageListDataProps<ScreenUserDto>,
  ): Promise<{ list: User[]; total: number }> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.userService.remove(id);
  }

  @Post(':id/setRole')
  setRole(
    @Param('id') id: string,
    @Body() userSetRoleDto: UserSetRoleDto,
  ): Promise<User> {
    return this.userService.setRole(id, userSetRoleDto);
  }

  @Post('setDepartment')
  setDepartment(@Body() userSetRoleDto: UserSetDeptDto): Promise<User> {
    return this.userService.setDepartment(userSetRoleDto);
  }
}
