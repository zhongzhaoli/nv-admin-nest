import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { EditRoleRoutesDto, UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';
import { GetRoleDto } from './dto/get-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { Route } from '../route/route.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Route) private routeRepository: Repository<Route>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.findOneByName(createRoleDto.name);
    if (role) throw new BadRequestException('角色名已存在');
    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  async editRoutes(id: string, routeIds: string[]): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['routes'],
    });
    if (!role) throw new BadRequestException('找不到此角色');
    // 删除多余的路由
    role.routes = role.routes.filter((routeItem: Route) => {
      routeIds.includes(routeItem.id);
    });
    // 添加新的路由
    const newRoutes = await this.routeRepository.find({
      where: { id: In(routeIds) },
    });
    role.routes = role.routes.concat(newRoutes);
    return this.roleRepository.save(role);
  }

  async findAll(query: GetRoleDto): Promise<{ list: Role[]; total: number }> {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = (page || 1 - 1) * take;
    const list = await this.roleRepository.find({
      where: query,
      skip,
      take,
    });
    const total = await this.roleRepository.count({
      where: query,
    });
    return {
      list,
      total,
    };
  }

  findOneByName(name: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { name } });
  }

  findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('角色不存在');
    const newUser = this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(newUser);
  }

  async remove(id: string): Promise<any> {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('找不到此角色');
    const result: DeleteResult = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
