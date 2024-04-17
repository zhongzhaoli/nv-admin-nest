import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Route } from 'src/route/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Route])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
