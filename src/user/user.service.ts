import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository } from 'typeorm';
import { User } from './user.entity';
import * as md5 from 'md5';
import { ResponseUserInfoProps, ScreenUserDto } from './dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSetDeptDto, UserSetRoleDto } from './dto/user-extra.dto';
import { Role } from '../role/role.entity';
import { Department } from '../department/department.entity';
import { pageListDataProps } from '../types/pageListBody.type';
import { formatDate } from '../utils/dateTime.helper';
import { ResponsePageProps } from '../types/responsePage.type';
import { Route } from '../route/route.entity';
import { routeTree } from '../utils/route.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Route) private routeRepository: Repository<Route>,
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
    if (!user.status) throw new BadRequestException('用户已被禁用');
    const token = await this.createToken(user.id);
    return {
      token,
    };
  }

  async getUserInfo(id: string): Promise<ResponseUserInfoProps> {
    const user = (await this.userRepository.findOne({
      where: { id },
      relations: ['department'],
    })) as ResponseUserInfoProps;
    if (user.department) {
      const departmemnt = await this.deptRepository.findOne({
        where: { id: user.department.id },
        relations: ['users'],
      });
      user.memberCount = departmemnt.users.length;
      user.memberAvatarList = departmemnt.users.map((item) => item.avatar);
    }
    return user;
  }

  async getUserRoutes(userReq: User) {
    const user = await this.userRepository.findOne({
      where: { id: userReq.id },
      relations: ['role', 'role.routes'],
    });
    const allRoutes = ((user.role && user.role.routes) || []).sort(
      (a, b) => a.sort - b.sort,
    );
    const pidSet = new Set<string>();
    const promiseList = [];
    async function findPidAndId(
      pid: string,
      routeRepository: Repository<Route>,
    ) {
      const route = await routeRepository.findOne({ where: { id: pid } });
      if (!route) return;
      if (!pidSet.has(pid)) {
        pidSet.add(pid);
        allRoutes.push(route);
        if (route.pid !== '0') findPidAndId(route.pid, routeRepository);
      }
    }
    allRoutes.forEach((item) => {
      pidSet.add(item.id);
      if (item.pid !== '0') {
        promiseList.push(findPidAndId(item.pid, this.routeRepository));
      }
    });
    await Promise.all(promiseList);
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

  async findAllExcludeMine(
    query: pageListDataProps<ScreenUserDto>,
    userId: string,
  ): Promise<ResponsePageProps<User>> {
    const { pageData, screenData } = query;
    const take = pageData.limit || 10;
    const skip = ((pageData.page || 1) - 1) * take;
    const list = await this.userRepository.find({
      where: { ...screenData, id: Not(userId) },
      relations: ['department', 'role'],
      skip,
      take,
    });
    list.forEach((user) => {
      user.createTime = formatDate(user.createTime) as unknown as Date;
      user.updateTime = formatDate(user.updateTime) as unknown as Date;
    });
    const total = await this.userRepository.count({
      where: { ...screenData, id: Not(userId) },
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

  async updateStatus(id: string, status: boolean): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('用户不存在');
    const newUser = this.userRepository.merge(user, { status });
    return this.userRepository.save(newUser);
  }

  async changePassword(id: string, data: ChangePasswordDto) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('用户不存在');
    const { oldPassword, newPassword } = data;
    if (user.password !== md5(oldPassword))
      throw new BadRequestException('原密码错误');
    const newUser = this.userRepository.merge(user, {
      password: md5(newPassword),
    });
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
