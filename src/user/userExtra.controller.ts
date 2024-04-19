import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TimestampInterceptor } from '../interceptor/timestamp.interceptor';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserReq } from '../types/userReq.type';
import { UserLoginDto } from './dto/user-login.dto';
import { ChangePasswordDto } from './dto/update-user.dto';

@Controller('user')
@UseInterceptors(TimestampInterceptor)
export class UserExtraController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() userLoginDto: UserLoginDto): Promise<{ token: string }> {
    return this.userService.login(userLoginDto);
  }

  @Get('userInfo')
  @UseGuards(AuthGuard('jwt'))
  getUserInfo(@Req() req: UserReq): Promise<User> {
    return this.userService.getUserInfo(req.user.id);
  }

  @Post('changePassword')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Req() req: UserReq, @Body() password: ChangePasswordDto) {
    console.log(password);
    return this.userService.changePassword(req.user.id, password);
  }

  @Get('routes')
  @UseGuards(AuthGuard('jwt'))
  getUserRoutes(@Req() req: UserReq) {
    return this.userService.getUserRoutes(req.user);
  }
}
