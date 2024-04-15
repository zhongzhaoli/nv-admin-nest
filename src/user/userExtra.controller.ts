import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TimestampInterceptor } from '../interceptor/timestamp.interceptor';
import { UserService } from './user.service';
import { UserSetDeptDto, UserSetRoleDto } from './dto/user-extra.dto';
import { User } from './user.entity';

@Controller('user')
@UseInterceptors(TimestampInterceptor)
export class UserExtraController {
  constructor(private readonly userService: UserService) {}

  @Post('setRole')
  setRole(@Body() userSetRoleDto: UserSetRoleDto): Promise<User> {
    return this.userService.setRole(userSetRoleDto);
  }

  @Post('setDepartment')
  setDepartment(@Body() userSetRoleDto: UserSetDeptDto): Promise<User> {
    return this.userService.setDepartment(userSetRoleDto);
  }
}
