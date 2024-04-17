import { Exclude } from 'class-transformer';
import { Role } from 'src/role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RouteType {
  'BUTTON' = 'BUTTON',
  'MENU' = 'MENU',
  'SINGLEMENU' = 'SINGLEMENU',
  'CATA' = 'CATA',
}

@Entity()
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pid: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 15 })
  title: string;

  @Column({ length: 30, nullable: true })
  icon: string;

  @Column({ length: 100 })
  path: string;

  @Column({ length: 150 })
  component: string;

  @Column({ default: false })
  breadcrumbHidden: boolean;

  @Column({ default: false })
  affix: boolean;

  @Column({ default: false })
  hidden: boolean;

  @Column({ default: false })
  keepAlive: boolean;

  @Column({ default: 1 })
  sort: number;

  @Column({ type: 'enum', enum: RouteType })
  type: RouteType;

  @ManyToMany(() => Role, (role) => role.routes)
  @JoinTable({ name: 'role_menu' })
  roles: Role[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude()
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude()
  updateTime: Date;
}
