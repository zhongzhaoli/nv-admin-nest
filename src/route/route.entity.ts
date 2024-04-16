import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pid: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 30 })
  icon: string;

  @Column({ length: 50 })
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

  @Column()
  sort: number;

  @Column({ enum: ['BUTTON', 'MENU', 'SINGLEMENU', 'CATA'] })
  type: string;

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
