import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getEnvConfig } from '../utils/dotenv.helper';
import { ConfigEnum } from '../enum/config.enum';
import { JwtStrategy } from './jwt.strategy';
import { UserExtraController } from './userExtra.controller';
import { Department } from '../department/department.entity';
import { Route } from '../route/route.entity';
import { TodoList } from '../todo-list/todo-list.entity';
import { Article } from 'src/article/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Department,
      Route,
      TodoList,
      Article,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: getEnvConfig()[ConfigEnum.JWT_SECRET] as string,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [UserController, UserExtraController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
