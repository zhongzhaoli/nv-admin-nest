import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoList } from './todo-list.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(createTodoListDto: CreateTodoListDto, user: User) {
    const todoList = this.todoListRepository.create({
      ...createTodoListDto,
      createUser: user,
    });
    return this.todoListRepository.save(todoList);
  }

  async findAll(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.todoList', 'todoList')
      .where('user.id = :userId', { userId })
      .orderBy('todoList.createTime', 'DESC')
      .getOne();
    if (!user) throw new BadRequestException('找不到此用户');
    const list = user.todoList;
    const noCList = list.filter((item) => item.active === false);
    const cList = list.filter((item) => item.active === true);
    return {
      list: noCList,
      end: cList,
    };
  }

  findOne(id: string) {
    return this.todoListRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTodoListDto: UpdateTodoListDto) {
    const todo = await this.findOne(id);
    if (!todo) throw new BadRequestException('待办不存在');
    const newUser = this.todoListRepository.merge(todo, updateTodoListDto);
    return this.todoListRepository.save(newUser);
  }

  async remove(id: string) {
    const todo = await this.findOne(id);
    if (!todo) throw new BadRequestException('找不到此待办');
    const result: DeleteResult = await this.todoListRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
