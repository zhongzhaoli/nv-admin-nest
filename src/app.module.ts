import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParams } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    RoleModule,
    DepartmentModule,
    RouteModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
