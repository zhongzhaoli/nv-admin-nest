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
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { TimestampInterceptor } from '../interceptor/timestamp.interceptor';
import { GetUserDto } from './dto/get-user.dto';
import { Serialize } from '../decorators/serialize.decorators';
import { AuthGuard } from '@nestjs/passport';
import { UserReq } from '../types/userReq.type';

@Controller('user')
@UseInterceptors(TimestampInterceptor)
@Serialize(User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() userLoginDto: UserLoginDto): Promise<{ token: string }> {
    return this.userService.login(userLoginDto);
  }

  @Get('userInfo')
  @UseGuards(AuthGuard('jwt'))
  getUserInfo(@Req() req: UserReq): Promise<User> {
    return this.userService.getUserInfo(req.user.id);
  }

  @Get()
  findAll(
    @Query() query: GetUserDto,
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
}
