import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserReq } from 'src/types/userReq.type';
import { pageListDataProps } from 'src/types/pageListBody.type';
import { ResponsePageProps } from 'src/types/responsePage.type';
import { Article } from './article.entity';
import { GetArticlePipe } from './pipes/get-article.pipe';
import { Serialize } from '../decorators/serialize.decorators';
import { User } from '../user/user.entity';

@Controller('article')
@UseGuards(AuthGuard('jwt'))
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: UserReq) {
    return this.articleService.create(createArticleDto, req.user);
  }

  @Get()
  @Serialize(User)
  findAll(
    @Query(GetArticlePipe)
    query: pageListDataProps,
    @Req() req: UserReq,
  ): Promise<ResponsePageProps<Article>> {
    return this.articleService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: UserReq) {
    return this.articleService.findOne(id, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: UserReq) {
    return this.articleService.remove(id, req.user);
  }
}
