import { Article } from '../article.entity';

export interface GetArticleDto {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface ResponseArticleProps extends Article {
  timestamp: string;
}

export interface ResPonseArticleOneProps extends Article {
  isAdmin: boolean;
}
