import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { Route } from './route.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
