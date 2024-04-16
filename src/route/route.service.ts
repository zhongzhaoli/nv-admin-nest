import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './route.entity';
import { DeleteResult, Repository } from 'typeorm';
import { GetRouteDto } from './dto/get-route.dto';

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
    const routes = await this.routeRepository.find();
    const rootRoute = this.routeFilterMap(routes, (v) => v.pid === '0');
    const noRootRoute = this.routeFilterMap(routes, (v) => v.pid !== '0');
    return this.routeTree(
      rootRoute as unknown as Route[],
      noRootRoute as unknown as Route[],
    );
  }

  routeTree(rootRoute: Route[], noRootRoute: Route[]) {
    rootRoute.forEach((item) => {
      item['children'] = noRootRoute.filter((v) => v.pid === item.id);
      this.routeTree(item['children'], noRootRoute);
    });
    return rootRoute;
  }

  routeFilterMap(list: Route[], fun: (item: Route) => boolean) {
    return list
      .filter((item) => fun(item))
      .map((v) => {
        const { id, pid, component, name, path } = v;
        return {
          id,
          pid,
          component,
          name,
          path,
          meta: {
            title: v.title,
            icon: v.icon,
            hidden: v.hidden,
            affix: v.affix,
            breadcrumb: !v.breadcrumbHidden,
            keepAlive: v.keepAlive,
          },
        };
      });
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
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('找不到此角色');
    const result: DeleteResult = await this.routeRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
