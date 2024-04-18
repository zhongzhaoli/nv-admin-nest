import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, User, Article])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
