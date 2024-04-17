import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { pageListDataProps } from '../types/pageListBody.type';
import { ResponsePageProps } from '../types/responsePage.type';
import { ScreenDepartmentDto } from './dto/get-department.dto';
import { formatDate } from '../utils/dateTime.helper';

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

  async addUser(deptId: string, userIds: string[]) {
    const dept = await this.findOne(deptId);
    if (!dept) throw new BadRequestException('找不到此部门');

    // 使用 map 方法创建一个包含所有异步操作的 promise 数组
    const updateUserPromises = userIds.map(async (userId) => {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) return; // 如果找不到用户，则直接返回
      user.department = dept;
      await this.userRepository.save(user);
    });

    // 使用 Promise.all 等待所有异步操作完成
    await Promise.all(updateUserPromises);
    console.log(2);
    return {};
  }

  async findAll(
    query: pageListDataProps<ScreenDepartmentDto>,
  ): Promise<ResponsePageProps<Department>> {
    const { pageData, screenData } = query;
    const take = pageData.limit || 10;
    const skip = ((pageData.page || 1) - 1) * take;
    const list = await this.deptRepository.find({
      where: screenData,
      relations: ['createUser'],
      skip,
      take,
    });
    list.forEach((dept) => {
      dept.createTime = formatDate(dept.createTime) as unknown as Date;
      dept.updateTime = formatDate(dept.updateTime) as unknown as Date;
    });
    const total = await this.deptRepository.count({
      where: screenData,
    });
    return {
      list,
      page: pageData.page || 1,
      total,
    };
  }

  findAllList(): Promise<Department[]> {
    return this.deptRepository.find();
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

  async removeUser(deptId: string, userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, department: { id: deptId } },
      relations: ['department'],
    });
    if (!user) throw new BadRequestException('找不到此用户');
    user.department = null;
    return this.userRepository.save(user);
  }
}
