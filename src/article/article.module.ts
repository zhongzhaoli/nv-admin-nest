import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Department } from '../department/department.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Department, User])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
