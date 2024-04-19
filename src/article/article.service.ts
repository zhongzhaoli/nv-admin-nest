import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Article } from './article.entity';
import { formatDate, timeAgo } from 'src/utils/dateTime.helper';
import { pageListDataProps } from 'src/types/pageListBody.type';
import {
  ResPonseArticleOneProps,
  ResponseArticleProps,
} from './dto/get-article.dto';
import { Department } from 'src/department/department.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Department)
    private deptRepository: Repository<Department>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}
  async create(createArticleDto: CreateArticleDto, user: User) {
    const mine = await this.userRepository.findOne({ where: { id: user.id } });
    if (!mine) throw new BadRequestException('用户不存在');
    const { title, content, whoType, deptList, userList } = createArticleDto;
    let deptRealList = [];
    let userRealList = [];
    if (whoType === 'can') {
      if (userList.length) {
        userRealList = await this.userRepository.find({
          where: { id: In(userList) },
        });
      }
      if (deptList.length) {
        deptRealList = await this.deptRepository.find({
          where: { id: In(deptList) },
        });
      }
    }
    if (whoType === 'cant') {
      if (userList.length) {
        userRealList = await this.userRepository.find({
          where: { id: Not(In(userList)) },
        });
      }
      if (deptList.length) {
        deptRealList = await this.deptRepository.find({
          where: { id: Not(In(deptList)) },
        });
      }
    }
    const newArticle = this.articleRepository.create({
      title,
      content,
      allCanSee: whoType === 'all' ? true : false,
      createUser: mine,
      departments: deptRealList,
      users: userRealList,
    });
    return this.articleRepository.save(newArticle);
  }

  async findAll(query: pageListDataProps, user: User) {
    const { pageData } = query;
    const take = pageData.limit || 10;
    const skip = ((pageData.page || 1) - 1) * take;
    const mine = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['department'],
    });
    const userId = mine.id;
    const departmentId = (mine.department && mine.department.id) || null;
    const articleList = (await this.articleRepository.find({
      order: { createTime: 'DESC' },
      relations: ['users', 'departments', 'createUser'],
    })) as ResponseArticleProps[];
    const list = articleList
      .filter((item) => {
        if (item.allCanSee) return true;
        const isMeAuthor = item.createUser.id === userId;
        const isMe = item.users.some((user) => user.id === userId);
        if (!departmentId) return isMe || isMeAuthor;
        const isMeDept = item.departments.some(
          (dept) => dept.id === departmentId,
        );
        return isMe || isMeAuthor || isMeDept;
      })
      .map((item) => {
        delete item.users;
        delete item.departments;
        item.createTime = formatDate(item.createTime) as unknown as Date;
        item.updateTime = formatDate(item.updateTime) as unknown as Date;
        item.timestamp = timeAgo(item.createTime);
        return item;
      });
    return {
      list: list.slice(skip, skip + take),
      page: pageData.page || 1,
      total: list.length,
    };
  }

  async findOne(id: string, user: User) {
    const article = (await this.articleRepository.findOne({
      where: { id: id },
      relations: ['createUser'],
    })) as ResPonseArticleOneProps;
    if (!article) throw new BadRequestException('通知不存在');
    article.createTime = formatDate(article.createTime) as unknown as Date;
    article.updateTime = formatDate(article.updateTime) as unknown as Date;
    article.isAdmin = article.createUser.id === user.id;
    return article;
  }

  async remove(id: string, user: User) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['createUser'],
    });
    if (article.createUser.id !== user.id)
      throw new BadRequestException('没有权限删除');
    const result = await this.articleRepository.delete({ id });
    if (result.affected === 0) {
      throw new BadRequestException(`删除失败`);
    }
    return {};
  }
}
