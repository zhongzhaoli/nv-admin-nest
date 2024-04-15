import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DeleteResult, Repository } from 'typeorm';
import { GetDepartmentDto } from './dto/get-department.dto';
import { User } from '../user/user.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private deptRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { name } = createDepartmentDto;
    const dept = await this.findOneByName(name);
    if (dept) throw new BadRequestException('部门已存在');
    const newDept = this.deptRepository.create(createDepartmentDto);
    return this.deptRepository.save(newDept);
  }

  async findAll(
    query: GetDepartmentDto,
  ): Promise<{ list: Department[]; total: number }> {
    const { limit, page, name } = query;
    const take = limit || 10;
    const skip = (page || 1 - 1) * take;
    const list = await this.deptRepository.find({
      where: name ? { name } : {},
      skip,
      take,
    });
    const total = await this.deptRepository.count({
      where: name ? { name } : {},
    });
    return {
      list,
      total,
    };
  }

  findOne(id: string): Promise<Department> {
    return this.deptRepository.findOne({ where: { id } });
  }

  async findUsers(id: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { department: { id } },
    });
    return users;
  }

  findOneByName(name: string): Promise<Department> {
    return this.deptRepository.findOne({ where: { name } });
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const dept = await this.findOne(id);
    if (!dept) throw new BadRequestException('找不到此部门');
    const newUser = this.deptRepository.merge(dept, updateDepartmentDto);
    return this.deptRepository.save(newUser);
  }

  async remove(id: string): Promise<any> {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('找不到此部门');
    const result: DeleteResult = await this.deptRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
