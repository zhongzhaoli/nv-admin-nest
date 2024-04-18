import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserReq } from '../types/userReq.type';

@Controller('todoList')
@UseGuards(AuthGuard('jwt'))
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  @Post()
  create(@Body() createTodoListDto: CreateTodoListDto, @Req() req: UserReq) {
    return this.todoListService.create(createTodoListDto, req.user);
  }

  @Get()
  findAll(@Req() req: UserReq) {
    return this.todoListService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoListService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    return this.todoListService.update(id, updateTodoListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoListService.remove(id);
  }
}
