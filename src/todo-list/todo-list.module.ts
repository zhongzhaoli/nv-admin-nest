import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList } from './todo-list.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList, User])],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}
