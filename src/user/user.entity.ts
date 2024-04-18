import { Exclude } from 'class-transformer';
import { Role } from '../role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Department } from '../department/department.entity';
import { TodoList } from '../todo-list/todo-list.entity';
import { Article } from 'src/article/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ length: 100 })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 20, nullable: true })
  realName: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsPhoneNumber('CN')
  phone: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Department, (dept) => dept.users, { nullable: true })
  @JoinColumn({ name: 'deptId' })
  department: Department;

  @OneToMany(() => Department, (dept) => dept.createUser)
  createDept: Department[];

  @OneToMany(() => TodoList, (todo) => todo.createUser)
  todoList: TodoList[];

  @ManyToMany(() => Article, (article) => article.users)
  article: Article[];

  @OneToMany(() => Article, (dept) => dept.createUser)
  createArticle: Article[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateTime: Date;
}
