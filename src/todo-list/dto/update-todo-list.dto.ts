import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoListDto } from './create-todo-list.dto';
import { IsOptional } from 'class-validator';

export class UpdateTodoListDto extends PartialType(CreateTodoListDto) {
  @IsOptional()
  active: boolean;
}
