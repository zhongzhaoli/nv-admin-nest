import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import * as md5 from 'md5';
import { GetUserDto } from './dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSetDeptDto, UserSetRoleDto } from './dto/user-extra.dto';
import { Role } from 'src/role/role.entity';
import { Department } from 'src/department/department.entity';

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
    const newCreateUserDto = {
      ...createUserDto,
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

  async setRole(userSetRoleDto: UserSetRoleDto): Promise<User> {
    const { userId, roleId } = userSetRoleDto;
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

  async findAll(query: GetUserDto): Promise<{ list: User[]; total: number }> {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = (page || 1 - 1) * take;
    const list = await this.userRepository.find({
      where: query,
      skip,
      take,
    });
    const total = await this.userRepository.count({
      where: query,
    });
    return {
      list,
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
    const newUser = this.userRepository.merge(user, updateUserDto);
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
