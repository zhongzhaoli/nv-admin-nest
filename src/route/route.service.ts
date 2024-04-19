import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route, RouteType } from './route.entity';
import { DeleteResult, Repository } from 'typeorm';
import { GetRouteDto } from './dto/get-route.dto';
import { routeTree, routeMap } from '../utils/route.helper';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route) private routeRepository: Repository<Route>,
  ) {}
  async create(createRouteDto: CreateRouteDto) {
    const route = await this.routeRepository.findOne({
      where: { path: createRouteDto.path },
    });
    if (route) throw new BadRequestException('路由已存在');
    const newRoute = this.routeRepository.create(createRouteDto);
    return this.routeRepository.save(newRoute);
  }

  async findAll(query: GetRouteDto) {
    const list = await this.routeRepository.find({
      where: query,
      order: { sort: 'ASC' },
    });
    const allList = await this.routeRepository.find({
      order: { sort: 'ASC' },
    });
    const routes = [];
    const isChildSet = new Set<string>();
    list.forEach((item) => {
      if (isChildSet.has(item.id)) return;
      routes.push(routeTree(item, allList, isChildSet, false));
    });
    return routes.filter((item) => !isChildSet.has(item.id));
  }

  findOne(id: string) {
    return this.routeRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('路由不存在');
    const newUser = this.routeRepository.merge(role, updateRouteDto);
    return this.routeRepository.save(newUser);
  }

  async remove(id: string) {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!route) throw new BadRequestException('找不到此路由');
    if (route.roles && route.roles.length)
      throw new BadRequestException('路由已被角色绑定，无法删除');
    const result: DeleteResult = await this.routeRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
