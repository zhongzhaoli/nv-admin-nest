import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import * as md5 from 'md5';
import { ScreenUserDto } from './dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSetDeptDto, UserSetRoleDto } from './dto/user-extra.dto';
import { Role } from '../role/role.entity';
import { Department } from '../department/department.entity';
import { routeTree, routeMap } from '../utils/route.helper';
import { pageListDataProps } from '../types/pageListBody.type';
import { formatDate } from '../utils/dateTime.helper';
import { ResponsePageProps } from '../types/responsePage.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Department)
    private deptRepository: Repository<Department>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findOneByUsername(createUserDto.username);
    if (user) throw new BadRequestException('用户名已存在');

    const department =
      (createUserDto.deptId &&
        createUserDto.deptId !== '0' &&
        (await this.deptRepository.findOne({
          where: { id: createUserDto.deptId },
        }))) ||
      null;
    const newCreateUserDto = {
      ...createUserDto,
      department,
      password: md5(createUserDto.password),
    };
    const newUser = this.userRepository.create(newCreateUserDto);
    return this.userRepository.save(newUser);
  }

  async login(userLoginDto: UserLoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: {
        username: userLoginDto.username,
        password: md5(userLoginDto.password),
      },
    });
    if (!user) throw new BadRequestException('用户名或密码错误');
    const token = await this.createToken(user.id);
    return {
      token,
    };
  }

  async getUserInfo(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserRoutes(userReq: User) {
    const user = await this.userRepository.findOne({
      where: { id: userReq.id },
      relations: ['role', 'role.routes'],
    });
    const allRoutes = (user.role && user.role.routes) || [];
    const routes = [];
    const isChildSet = new Set<string>();
    allRoutes.forEach((item) => {
      if (isChildSet.has(item.id)) return;
      routes.push(routeTree(item, allRoutes, isChildSet, true));
    });
    return routes.filter((item) => !isChildSet.has(item.id));
  }

  async setRole(userId: string, userSetRoleDto: UserSetRoleDto): Promise<User> {
    const { roleId } = userSetRoleDto;
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new BadRequestException('找不到此角色');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('找不到此用户');
    const newUser = this.userRepository.merge(user, { role });
    return this.userRepository.save(newUser);
  }

  async setDepartment(userSetRoleDto: UserSetDeptDto): Promise<User> {
    const { userId, deptId } = userSetRoleDto;
    const dept = await this.deptRepository.findOne({ where: { id: deptId } });
    if (!dept) throw new BadRequestException('找不到此部门');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('找不到此用户');
    const newUser = this.userRepository.merge(user, { department: dept });
    return this.userRepository.save(newUser);
  }

  async createToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync({
      sub: userId,
    });
  }

  async findAll(
    query: pageListDataProps<ScreenUserDto>,
  ): Promise<ResponsePageProps<User>> {
    const { pageData, screenData } = query;
    const take = pageData.limit || 10;
    const skip = ((pageData.page || 1) - 1) * take;
    const list = await this.userRepository.find({
      where: screenData,
      relations: ['department', 'role'],
      skip,
      take,
    });
    list.forEach((user) => {
      user.createTime = formatDate(user.createTime) as unknown as Date;
      user.updateTime = formatDate(user.updateTime) as unknown as Date;
    });
    const total = await this.userRepository.count({
      where: screenData,
    });
    return {
      list,
      page: pageData.page || 1,
      total,
    };
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('用户不存在');
    const department =
      (updateUserDto.deptId &&
        updateUserDto.deptId !== '0' &&
        (await this.deptRepository.findOne({
          where: { id: updateUserDto.deptId },
        }))) ||
      null;

    const updateUser = { ...updateUserDto, department };
    const newUser = this.userRepository.merge(user, updateUser);
    return this.userRepository.save(newUser);
  }

  async remove(id: string): Promise<any> {
    const role = await this.findOne(id);
    if (!role) throw new BadRequestException('找不到此用户');
    const result: DeleteResult = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
