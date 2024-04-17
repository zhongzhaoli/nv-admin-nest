import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetRoleDto } from '../dto/get-role.dto';
import { excludeNullValue } from '../../utils/query.helper';

@Injectable()
export class GetRolePipe implements PipeTransform {
  transform(value: GetRoleDto, metadata: ArgumentMetadata) {
    const screenData = excludeNullValue<GetRoleDto>(value);
    delete screenData.page;
    delete screenData.pageSize;
    const pageData = { page: +value.page, limit: +value.pageSize };
    return { pageData, screenData };
  }
}
