import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import * as md5 from 'md5';
import { GetUserDto } from './dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async createToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync({
      sub: userId,
    });
  }

  async findAll(query: GetUserDto): Promise<{ list: User[]; total: number }> {
    const { limit, page, username } = query;
    const take = limit || 10;
    const skip = (page || 1 - 1) * take;
    const list = await this.userRepository.find({
      where: username ? { username } : {},
      skip,
      take,
    });
    const total = await this.userRepository.count({
      where: username ? { username } : {},
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
