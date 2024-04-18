import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetArticleDto } from '../dto/get-article.dto';
import { excludeNullValue } from '../../utils/query.helper';

@Injectable()
export class GetArticlePipe implements PipeTransform {
  transform(value: GetArticleDto, metadata: ArgumentMetadata) {
    const screenData = excludeNullValue<GetArticleDto>(value);
    delete screenData.page;
    delete screenData.pageSize;
    const pageData = { page: +value.page, limit: +value.pageSize };
    return { pageData, screenData };
  }
}
