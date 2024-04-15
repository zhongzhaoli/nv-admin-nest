import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';
import { GetRoleDto } from './dto/get-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.findOneByName(createRoleDto.name);
    if (role) throw new BadRequestException('角色名已存在');
    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  async findAll(query: GetRoleDto): Promise<{ list: Role[]; total: number }> {
    const { limit, page, name } = query;
    const take = limit || 10;
    const skip = (page || 1 - 1) * take;
    const list = await this.roleRepository.find({
      where: name ? { name } : {},
      skip,
      take,
    });
    const total = await this.roleRepository.count({
      where: name ? { name } : {},
    });
    return {
      list,
      total,
    };
  }

  findOneByName(name: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { name } });
  }

  findOne(id: number): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('角色不存在');
    const newUser = this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(newUser);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('找不到此角色');
    const result: DeleteResult = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
